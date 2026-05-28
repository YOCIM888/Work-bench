import { ref, computed } from 'vue'

export function useRadixConverter() {
  const decValue = ref(0)
  const bitWidth = ref(32)
  const activeInput = ref('dec')
  const inputErrors = ref({ bin: false, oct: false, dec: false, hex: false })

  const charInput = ref('')
  const codePointInput = ref('')

  function padZero(str, width, radix) {
    const chars = radix === 2 ? width : Math.ceil(width / (radix === 8 ? 3 : 4))
    return str.padStart(chars, '0')
  }

  function groupBin(str) {
    return str.replace(/(.{4})/g, '$1 ').trim()
  }

  function groupHex(str) {
    return str.replace(/(.{2})/g, '$1 ').trim()
  }

  const binValue = computed(() => {
    if (decValue.value === null || decValue.value === undefined) return ''
    const val = decValue.value >>> 0
    const maxVal = bitWidth.value <= 32 ? (1 << bitWidth.value) >>> 0 : Math.pow(2, bitWidth.value)
    const clamped = val % maxVal
    const raw = clamped.toString(2)
    return groupBin(padZero(raw, bitWidth.value, 2))
  })

  const octValue = computed(() => {
    if (decValue.value === null || decValue.value === undefined) return ''
    const val = decValue.value >>> 0
    const maxVal = bitWidth.value <= 32 ? (1 << bitWidth.value) >>> 0 : Math.pow(2, bitWidth.value)
    const clamped = val % maxVal
    return padZero(clamped.toString(8), bitWidth.value, 8)
  })

  const hexValue = computed(() => {
    if (decValue.value === null || decValue.value === undefined) return ''
    const val = decValue.value >>> 0
    const maxVal = bitWidth.value <= 32 ? (1 << bitWidth.value) >>> 0 : Math.pow(2, bitWidth.value)
    const clamped = val % maxVal
    return groupHex(padZero(clamped.toString(16).toUpperCase(), bitWidth.value, 16))
  })

  const decDisplay = computed(() => {
    if (decValue.value === null || decValue.value === undefined) return ''
    return decValue.value.toString(10)
  })

  function validateInput(val, radix) {
    if (!val || val.trim() === '') return true
    const cleaned = val.replace(/\s/g, '')
    const validChars = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/
    }
    return validChars[radix]?.test(cleaned) ?? false
  }

  function updateFromBin(val) {
    activeInput.value = 'bin'
    const cleaned = val.replace(/\s/g, '')
    if (!validateInput(cleaned, 2)) {
      inputErrors.value.bin = true
      return
    }
    inputErrors.value.bin = false
    decValue.value = cleaned ? parseInt(cleaned, 2) : 0
  }

  function updateFromOct(val) {
    activeInput.value = 'oct'
    const cleaned = val.trim()
    if (!validateInput(cleaned, 8)) {
      inputErrors.value.oct = true
      return
    }
    inputErrors.value.oct = false
    decValue.value = cleaned ? parseInt(cleaned, 8) : 0
  }

  function updateFromDec(val) {
    activeInput.value = 'dec'
    const cleaned = val.trim()
    if (!validateInput(cleaned, 10)) {
      inputErrors.value.dec = true
      return
    }
    inputErrors.value.dec = false
    decValue.value = cleaned ? parseInt(cleaned, 10) : 0
  }

  function updateFromHex(val) {
    activeInput.value = 'hex'
    const cleaned = val.replace(/\s/g, '')
    if (!validateInput(cleaned, 16)) {
      inputErrors.value.hex = true
      return
    }
    inputErrors.value.hex = false
    decValue.value = cleaned ? parseInt(cleaned, 16) : 0
  }

  const charResults = computed(() => {
    if (!charInput.value) return []
    return [...charInput.value].map(ch => {
      const code = ch.codePointAt(0)
      return {
        char: ch,
        decimal: code,
        hex: code.toString(16).toUpperCase().padStart(code > 0xFFFF ? 6 : 4, '0'),
        unicode: code > 0xFFFF ? `\\u{${code.toString(16).toUpperCase()}}` : `\\u${code.toString(16).toUpperCase().padStart(4, '0')}`,
        htmlEntity: `&#${code};`
      }
    })
  })

  const decodedChar = computed(() => {
    const code = parseInt(codePointInput.value.trim(), 10)
    if (isNaN(code) || code < 0 || code > 0x10FFFF) return null
    try {
      return String.fromCodePoint(code)
    } catch {
      return null
    }
  })

  const codePointError = computed(() => {
    const val = codePointInput.value.trim()
    if (!val) return false
    const code = parseInt(val, 10)
    return isNaN(code) || code < 0 || code > 0x10FFFF
  })

  return {
    decValue, bitWidth, activeInput, inputErrors,
    binValue, octValue, decDisplay, hexValue,
    updateFromBin, updateFromOct, updateFromDec, updateFromHex,
    charInput, charResults,
    codePointInput, decodedChar, codePointError
  }
}
