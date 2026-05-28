import { ref, computed } from 'vue'
import * as Diff from 'diff'

export function useDiff() {
  const originalText = ref('')
  const modifiedText = ref('')
  const viewMode = ref('side-by-side')

  const lineDiff = computed(() => {
    if (!originalText.value && !modifiedText.value) return []
    return Diff.diffLines(originalText.value, modifiedText.value)
  })

  const sideBySideLines = computed(() => {
    const left = []
    const right = []
    let leftLine = 1
    let rightLine = 1

    for (const part of lineDiff.value) {
      const lines = part.value.replace(/\n$/, '').split('\n')
      if (part.added) {
        for (const line of lines) {
          right.push({ text: line, type: 'added', lineNum: rightLine++ })
        }
      } else if (part.removed) {
        for (const line of lines) {
          left.push({ text: line, type: 'removed', lineNum: leftLine++ })
        }
      } else {
        for (const line of lines) {
          left.push({ text: line, type: 'unchanged', lineNum: leftLine++ })
          right.push({ text: line, type: 'unchanged', lineNum: rightLine++ })
        }
      }
    }

    const maxLen = Math.max(left.length, right.length)
    for (let i = 0; i < maxLen; i++) {
      if (!left[i]) left.push({ text: '', type: 'empty', lineNum: null })
      if (!right[i]) right.push({ text: '', type: 'empty', lineNum: null })
    }

    return { left, right }
  })

  const unifiedLines = computed(() => {
    const result = []
    let lineNum = 1
    for (const part of lineDiff.value) {
      const lines = part.value.replace(/\n$/, '').split('\n')
      for (const line of lines) {
        let type = 'unchanged'
        if (part.added) type = 'added'
        else if (part.removed) type = 'removed'
        result.push({ text: line, type, lineNum: type !== 'added' ? lineNum++ : null })
      }
    }
    return result
  })

  const stats = computed(() => {
    let added = 0
    let removed = 0
    for (const part of lineDiff.value) {
      const count = part.value.replace(/\n$/, '').split('\n').length
      if (part.added) added += count
      else if (part.removed) removed += count
    }
    return { added, removed }
  })

  function swapTexts() {
    const temp = originalText.value
    originalText.value = modifiedText.value
    modifiedText.value = temp
  }

  function clearAll() {
    originalText.value = ''
    modifiedText.value = ''
  }

  return {
    originalText, modifiedText, viewMode,
    sideBySideLines, unifiedLines, stats,
    swapTexts, clearAll
  }
}
