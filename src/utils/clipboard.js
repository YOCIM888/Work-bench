import { reactive } from 'vue'

// 全局 Toast 状态
export const toastState = reactive({ visible: false, message: '', icon: '✓' })

let timer = null

export function toast(message, icon = '✓') {
  toastState.visible = true
  toastState.message = message
  toastState.icon = icon
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    toastState.visible = false
  }, 1500)
}

// 复制文本到剪贴板，并显示 Toast 反馈
export async function copy(text, message = '已复制') {
  if (text === undefined || text === null || text === '') return
  try {
    await navigator.clipboard.writeText(text)
    toast(message, '✓')
  } catch {
    // 降级方案
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      toast(message, '✓')
    } catch {
      toast('复制失败', '✕')
    }
  }
}
