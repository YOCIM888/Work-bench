import { ref, computed } from 'vue'
import jsQR from 'jsqr'

export function useQrcodeParser() {
  const imageSrc = ref('')
  const parsedText = ref('')
  const error = ref('')

  const parsedType = computed(() => {
    const text = parsedText.value
    if (!text) return 'text'
    if (/^https?:\/\//i.test(text)) return 'url'
    if (text.startsWith('BEGIN:VCARD')) return 'vcard'
    if (text.startsWith('WIFI:')) return 'wifi'
    return 'text'
  })

  const parsedDetails = computed(() => {
    const text = parsedText.value
    if (parsedType.value === 'wifi') {
      const ssid = text.match(/S:([^;]*)/)?.[1] || ''
      const password = text.match(/P:([^;]*)/)?.[1] || ''
      const encryption = text.match(/T:([^;]*)/)?.[1] || ''
      return { ssid, password, encryption }
    }
    if (parsedType.value === 'vcard') {
      const name = text.match(/FN:(.*)/)?.[1] || ''
      const phone = text.match(/TEL:(.*)/)?.[1] || ''
      const email = text.match(/EMAIL:(.*)/)?.[1] || ''
      const org = text.match(/ORG:(.*)/)?.[1] || ''
      return { name, phone, email, org }
    }
    return null
  })

  function parseImage(file) {
    if (!file) return
    error.value = ''
    parsedText.value = ''
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          parsedText.value = code.data
        } else {
          error.value = 'noQrFound'
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  function clear() {
    imageSrc.value = ''
    parsedText.value = ''
    error.value = ''
  }

  return {
    imageSrc, parsedText, parsedType, parsedDetails, error,
    parseImage, clear
  }
}
