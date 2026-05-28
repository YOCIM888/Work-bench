import { ref, computed } from 'vue'

export function useRegex() {
  const pattern = ref('')
  const flags = ref('g')
  const testString = ref('')

  const flagOptions = [
    { key: 'g', label: 'global' },
    { key: 'i', label: 'ignoreCase' },
    { key: 'm', label: 'multiline' },
    { key: 's', label: 'dotAll' }
  ]

  const presets = [
    { key: 'presetEmail', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
    { key: 'presetUrl', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*', flags: 'gi' },
    { key: 'presetPhone', pattern: '1[3-9]\\d{9}', flags: 'g' },
    { key: 'presetIp', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', flags: 'g' },
    { key: 'presetDate', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}', flags: 'g' },
    { key: 'presetNumber', pattern: '-?\\d+(\\.\\d+)?', flags: 'g' }
  ]

  function toggleFlag(flag) {
    if (flags.value.includes(flag)) {
      flags.value = flags.value.replace(flag, '')
    } else {
      flags.value += flag
    }
  }

  function applyPreset(preset) {
    pattern.value = preset.pattern
    flags.value = preset.flags
  }

  const regexError = computed(() => {
    if (!pattern.value) return null
    try {
      new RegExp(pattern.value, flags.value)
      return null
    } catch (e) {
      return e.message
    }
  })

  const matches = computed(() => {
    if (!pattern.value || !testString.value || regexError.value) return []
    try {
      const regex = new RegExp(pattern.value, flags.value)
      const results = []
      if (flags.value.includes('g')) {
        let match
        let safety = 0
        while ((match = regex.exec(testString.value)) !== null) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || null
          })
          safety++
          if (safety > 1000) break
          if (match[0].length === 0) regex.lastIndex++
        }
      } else {
        const match = regex.exec(testString.value)
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || null
          })
        }
      }
      return results
    } catch {
      return []
    }
  })

  const highlightedParts = computed(() => {
    if (!pattern.value || !testString.value || regexError.value || matches.value.length === 0) {
      return [{ text: testString.value, highlight: false }]
    }
    const parts = []
    let lastIndex = 0
    for (const match of matches.value) {
      if (match.index > lastIndex) {
        parts.push({ text: testString.value.slice(lastIndex, match.index), highlight: false })
      }
      parts.push({ text: match.text, highlight: true, index: match.index })
      lastIndex = match.index + match.text.length
    }
    if (lastIndex < testString.value.length) {
      parts.push({ text: testString.value.slice(lastIndex), highlight: false })
    }
    return parts
  })

  const matchCount = computed(() => matches.value.length)

  return {
    pattern, flags, testString,
    flagOptions, presets,
    toggleFlag, applyPreset,
    regexError, matches,
    highlightedParts, matchCount
  }
}
