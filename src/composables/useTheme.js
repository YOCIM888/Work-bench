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
    // 默认使用夜间模式
    isDark.value = true
  }
  applyTheme()
}

export function useTheme() {
  return { isDark, toggleTheme, initTheme }
}
