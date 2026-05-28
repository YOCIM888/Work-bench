import { ref, computed } from 'vue'

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

export function usePassword() {
  const length = ref(16)
  const useUppercase = ref(true)
  const useLowercase = ref(true)
  const useNumbers = ref(true)
  const useSymbols = ref(true)
  const batchCount = ref(1)
  const passwords = ref([])

  const charset = computed(() => {
    let cs = ''
    if (useUppercase.value) cs += CHARS.uppercase
    if (useLowercase.value) cs += CHARS.lowercase
    if (useNumbers.value) cs += CHARS.numbers
    if (useSymbols.value) cs += CHARS.symbols
    return cs
  })

  const hasCharType = computed(() => charset.value.length > 0)

  function generateOne() {
    if (!hasCharType.value) return ''
    const array = new Uint32Array(length.value)
    crypto.getRandomValues(array)
    let result = ''
    for (let i = 0; i < length.value; i++) {
      result += charset.value[array[i] % charset.value.length]
    }
    return result
  }

  function generate() {
    if (!hasCharType.value) {
      passwords.value = []
      return
    }
    const results = []
    for (let i = 0; i < batchCount.value; i++) {
      results.push(generateOne())
    }
    passwords.value = results
  }

  function evaluateStrength(password) {
    if (!password) return { score: 0, level: 'weak', crackTime: 'instantly' }
    let poolSize = 0
    if (/[a-z]/.test(password)) poolSize += 26
    if (/[A-Z]/.test(password)) poolSize += 26
    if (/[0-9]/.test(password)) poolSize += 10
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32
    const combinations = Math.pow(poolSize, password.length)
    const guessesPerSecond = 1e10
    const seconds = combinations / guessesPerSecond / 2

    let level = 'weak'
    let crackTimeKey = 'instantly'
    if (seconds < 1) {
      level = 'weak'
      crackTimeKey = 'instantly'
    } else if (seconds < 60) {
      level = 'weak'
      crackTimeKey = 'seconds'
    } else if (seconds < 3600) {
      level = 'weak'
      crackTimeKey = 'minutes'
    } else if (seconds < 86400) {
      level = 'medium'
      crackTimeKey = 'hours'
    } else if (seconds < 86400 * 365) {
      level = 'medium'
      crackTimeKey = 'days'
    } else if (seconds < 86400 * 365 * 100) {
      level = 'strong'
      crackTimeKey = 'years'
    } else {
      level = 'veryStrong'
      crackTimeKey = 'centuries'
    }

    const crackTimeValue = crackTimeKey === 'instantly' || crackTimeKey === 'centuries'
      ? null
      : crackTimeKey === 'seconds' ? Math.floor(seconds)
      : crackTimeKey === 'minutes' ? Math.floor(seconds / 60)
      : crackTimeKey === 'hours' ? Math.floor(seconds / 3600)
      : crackTimeKey === 'days' ? Math.floor(seconds / 86400)
      : Math.floor(seconds / (86400 * 365))

    return { level, crackTimeKey, crackTimeValue }
  }

  return {
    length, useUppercase, useLowercase, useNumbers, useSymbols,
    batchCount, passwords, hasCharType,
    generate, evaluateStrength
  }
}
