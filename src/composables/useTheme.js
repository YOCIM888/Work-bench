import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'workbench-theme'

const isDark = ref(false)

function applyTheme() {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
  localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark') {
    isDark.value = true
  } else if (saved === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  }
  applyTheme()
}

export function useTheme() {
  return { isDark, toggleTheme, initTheme }
}
