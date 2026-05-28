import { ref, computed } from 'vue'

export function useBase64() {
  const inputText = ref('')
  const mode = ref('encode')
  const urlSafe = ref(false)

  const outputText = computed(() => {
    if (!inputText.value) return ''
    try {
      if (mode.value === 'encode') {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(inputText.value)
        let binary = ''
        bytes.forEach(b => { binary += String.fromCharCode(b) })
        let result = btoa(binary)
        if (urlSafe.value) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        }
        return result
      } else {
        let base64 = inputText.value.trim()
        if (urlSafe.value) {
          base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
          const pad = base64.length % 4
          if (pad) base64 += '='.repeat(4 - pad)
        }
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const decoder = new TextDecoder()
        return decoder.decode(bytes)
      }
    } catch {
      return null
    }
  })

  const error = computed(() => {
    if (!inputText.value) return false
    return outputText.value === null
  })

  const inputLength = computed(() => inputText.value.length)
  const outputLength = computed(() => {
    const val = outputText.value
    return val ? val.length : 0
  })

  function encodeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        const base64 = dataUrl.split(',')[1]
        if (urlSafe.value) {
          resolve(base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
        } else {
          resolve(base64)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function decodeToFile(base64String, filename) {
    let base64 = base64String.trim()
    if (urlSafe.value) {
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
      const pad = base64.length % 4
      if (pad) base64 += '='.repeat(4 - pad)
    }
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'decoded-file'
    a.click()
    URL.revokeObjectURL(url)
  }

  function swapMode() {
    if (mode.value === 'encode') {
      const currentOutput = outputText.value
      mode.value = 'decode'
      if (currentOutput && currentOutput !== null) {
        inputText.value = currentOutput
      }
    } else {
      const currentOutput = outputText.value
      mode.value = 'encode'
      if (currentOutput && currentOutput !== null) {
        inputText.value = currentOutput
      }
    }
  }

  function clearAll() {
    inputText.value = ''
  }

  return {
    inputText, mode, urlSafe,
    outputText, error,
    inputLength, outputLength,
    encodeFile, decodeToFile,
    swapMode, clearAll
  }
}
