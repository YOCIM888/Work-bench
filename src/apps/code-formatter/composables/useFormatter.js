import { ref } from 'vue'
import jsBeautify from 'js-beautify'
const { js: jsFormat, html: htmlFormat, css: cssFormat } = jsBeautify

export function useFormatter() {
  const inputCode = ref('')
  const outputCode = ref('')
  const language = ref('javascript')
  const indentSize = ref(2)
  const indentType = ref('space')

  const languageExtensions = {
    javascript: 'js',
    typescript: 'ts',
    html: 'html',
    css: 'css',
    json: 'json',
    xml: 'xml',
    sql: 'sql',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    rust: 'rs',
    php: 'php',
    markdown: 'md',
    yaml: 'yml'
  }

  function getIndentChar() {
    if (indentType.value === 'tab') return '\t'
    return ' '.repeat(indentSize.value)
  }

  function formatWithJsBeautify(code, lang) {
    const indentChar = getIndentChar()
    const opts = {
      indent_size: indentType.value === 'tab' ? 1 : indentSize.value,
      indent_char: indentChar,
      indent_with_tabs: indentType.value === 'tab'
    }
    if (lang === 'javascript' || lang === 'typescript') {
      return jsFormat(code, opts)
    } else if (lang === 'html') {
      return htmlFormat(code, opts)
    } else if (lang === 'css') {
      return cssFormat(code, opts)
    }
    return code
  }

  function basicIndentFormat(code, lang) {
    const indentChar = getIndentChar()
    const lines = code.split('\n')
    let indentLevel = 0
    const result = []

    const increaseAfter = {
      python: [':$'],
      java: ['\\{$', '\\[$', '\\($'],
      cpp: ['\\{$', '\\[$', '\\($'],
      go: ['\\{$', '\\[$'],
      rust: ['\\{$', '\\[$'],
      php: ['\\{$', '\\[$'],
      sql: ['\\bBEGIN\\b', '\\bTHEN\\b', '\\bELSE\\b'],
      yaml: [':$'],
      markdown: []
    }

    const decreaseBefore = {
      python: [],
      java: ['^\\s*\\}', '^\\s*\\]', '^\\s*\\)'],
      cpp: ['^\\s*\\}', '^\\s*\\]', '^\\s*\\)'],
      go: ['^\\s*\\}', '^\\s*\\]'],
      rust: ['^\\s*\\}', '^\\s*\\]'],
      php: ['^\\s*\\}', '^\\s*\\]', '^\\s*\\)'],
      sql: ['\\bEND\\b'],
      yaml: [],
      markdown: []
    }

    const incPatterns = increaseAfter[lang] || ['\\{$', '\\[$']
    const decPatterns = decreaseBefore[lang] || ['^\\s*\\}', '^\\s*\\]']

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        result.push('')
        continue
      }

      for (const pattern of decPatterns) {
        if (new RegExp(pattern).test(trimmed)) {
          indentLevel = Math.max(0, indentLevel - 1)
        }
      }

      result.push(indentChar.repeat(indentLevel) + trimmed)

      for (const pattern of incPatterns) {
        if (new RegExp(pattern).test(trimmed)) {
          indentLevel++
        }
      }
    }

    return result.join('\n')
  }

  function formatJson(code) {
    try {
      const obj = JSON.parse(code)
      const indentChar = indentType.value === 'tab' ? '\t' : indentSize.value
      return JSON.stringify(obj, null, indentChar)
    } catch {
      return code
    }
  }

  function formatXml(code) {
    const indentChar = getIndentChar()
    let formatted = ''
    let indentLevel = 0
    const tags = code.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean)

    for (const tag of tags) {
      if (tag.match(/^<\/\w/)) {
        indentLevel = Math.max(0, indentLevel - 1)
        formatted += indentChar.repeat(indentLevel) + tag + '\n'
      } else if (tag.match(/^<\w[^>]*[^/]>$/)) {
        formatted += indentChar.repeat(indentLevel) + tag + '\n'
        indentLevel++
      } else {
        formatted += indentChar.repeat(indentLevel) + tag + '\n'
      }
    }

    return formatted.trim()
  }

  function formatCode() {
    const code = inputCode.value
    if (!code.trim()) {
      outputCode.value = ''
      return
    }

    const lang = language.value

    if (lang === 'json') {
      outputCode.value = formatJson(code)
    } else if (lang === 'xml') {
      outputCode.value = formatXml(code)
    } else if (lang === 'javascript' || lang === 'typescript' || lang === 'html' || lang === 'css') {
      outputCode.value = formatWithJsBeautify(code, lang)
    } else {
      outputCode.value = basicIndentFormat(code, lang)
    }
  }

  function clearAll() {
    inputCode.value = ''
    outputCode.value = ''
  }

  function getExtension() {
    return languageExtensions[language.value] || 'txt'
  }

  return {
    inputCode,
    outputCode,
    language,
    indentSize,
    indentType,
    formatCode,
    clearAll,
    getExtension,
    languageExtensions
  }
}
