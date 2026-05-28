import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const STORAGE_KEY = 'yocim-bench-markdown-content'

marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch {}
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

function loadContent() {
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function useMarkdown() {
  const content = ref(loadContent())

  watch(content, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, val)
    } catch {}
  })

  const html = computed(() => {
    if (!content.value) return ''
    return marked.parse(content.value)
  })

  const wordCount = computed(() => {
    const text = content.value.replace(/\s/g, '')
    return text.length
  })

  function insertMarkdown(type, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.substring(start, end)
    let before = ''
    let after = ''
    let insert = ''

    switch (type) {
      case 'bold':
        before = '**'; after = '**'; insert = selected || 'bold text'; break
      case 'italic':
        before = '*'; after = '*'; insert = selected || 'italic text'; break
      case 'strikethrough':
        before = '~~'; after = '~~'; insert = selected || 'strikethrough'; break
      case 'heading1':
        before = '# '; insert = selected || 'Heading 1'; break
      case 'heading2':
        before = '## '; insert = selected || 'Heading 2'; break
      case 'heading3':
        before = '### '; insert = selected || 'Heading 3'; break
      case 'unorderedList':
        before = '- '; insert = selected || 'List item'; break
      case 'orderedList':
        before = '1. '; insert = selected || 'List item'; break
      case 'link':
        before = '['; after = '](url)'; insert = selected || 'link text'; break
      case 'image':
        before = '!['; after = '](url)'; insert = selected || 'alt text'; break
      case 'inlineCode':
        before = '`'; after = '`'; insert = selected || 'code'; break
      case 'codeBlock':
        before = '```\n'; after = '\n```'; insert = selected || 'code block'; break
      case 'blockquote':
        before = '> '; insert = selected || 'blockquote'; break
      case 'horizontalRule':
        before = '\n---\n'; insert = ''; break
      default:
        return
    }

    const newContent = content.value.substring(0, start) + before + insert + after + content.value.substring(end)
    content.value = newContent

    requestAnimationFrame(() => {
      const newPos = start + before.length + insert.length + after.length
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    })
  }

  function downloadMd() {
    const blob = new Blob([content.value], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadHtml() {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Markdown Document</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 980px; margin: 0 auto; padding: 45px; color: #24292e; line-height: 1.6; }
h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
h3 { font-size: 1.25em; }
code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background: rgba(27,31,35,0.05); border-radius: 3px; }
pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background: #f6f8fa; border-radius: 6px; }
pre code { padding: 0; background: transparent; }
blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; }
img { max-width: 100%; }
a { color: #0366d6; text-decoration: none; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 6px 13px; border: 1px solid #dfe2e5; }
tr:nth-child(even) { background: #f6f8fa; }
</style>
</head>
<body>
${html.value}
</body>
</html>`
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    content, html, wordCount,
    insertMarkdown, downloadMd, downloadHtml
  }
}
