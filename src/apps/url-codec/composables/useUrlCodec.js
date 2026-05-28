import { ref, computed } from 'vue'

export function useUrlCodec() {
  const inputText = ref('')
  const mode = ref('encode')
  const fullEncode = ref(true)

  const outputText = computed(() => {
    if (!inputText.value) return ''
    try {
      if (mode.value === 'encode') {
        return fullEncode.value
          ? encodeURIComponent(inputText.value)
          : encodeURI(inputText.value)
      } else {
        return fullEncode.value
          ? decodeURIComponent(inputText.value)
          : decodeURI(inputText.value)
      }
    } catch {
      return null
    }
  })

  const error = computed(() => {
    if (!inputText.value) return false
    return outputText.value === null
  })

  function swapMode() {
    if (outputText.value && outputText.value !== null) {
      const currentOutput = outputText.value
      mode.value = mode.value === 'encode' ? 'decode' : 'encode'
      inputText.value = currentOutput
    } else {
      mode.value = mode.value === 'encode' ? 'decode' : 'encode'
    }
  }

  function clearAll() {
    inputText.value = ''
  }

  const urlInput = ref('')
  const urlParsed = computed(() => {
    if (!urlInput.value) return null
    try {
      const url = new URL(urlInput.value)
      const params = []
      url.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || '-',
        pathname: url.pathname,
        hash: url.hash || '-',
        search: url.search || '-',
        params
      }
    } catch {
      return null
    }
  })

  const urlError = computed(() => {
    if (!urlInput.value) return false
    return urlParsed.value === null
  })

  const sortedParams = computed(() => {
    if (!urlParsed.value) return []
    return [...urlParsed.value.params].sort((a, b) => a.key.localeCompare(b.key))
  })

  return {
    inputText, mode, fullEncode,
    outputText, error,
    swapMode, clearAll,
    urlInput, urlParsed, urlError, sortedParams
  }
}
