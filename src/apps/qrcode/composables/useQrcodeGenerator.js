import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

export function useQrcodeGenerator() {
  const contentType = ref('text')
  const textContent = ref('')
  const urlContent = ref('')
  const vcardFields = ref({ name: '', phone: '', email: '', org: '', address: '' })
  const wifiFields = ref({ ssid: '', password: '', encryption: 'WPA' })
  const size = ref(256)
  const fgColor = ref('#000000')
  const bgColor = ref('#ffffff')
  const errorLevel = ref('M')
  const canvasRef = ref(null)
  const copied = ref(false)

  const inputText = computed(() => {
    if (contentType.value === 'text') return textContent.value
    if (contentType.value === 'url') return urlContent.value
    if (contentType.value === 'vcard') {
      const v = vcardFields.value
      let card = 'BEGIN:VCARD\nVERSION:3.0'
      if (v.name) card += `\nFN:${v.name}`
      if (v.org) card += `\nORG:${v.org}`
      if (v.phone) card += `\nTEL:${v.phone}`
      if (v.email) card += `\nEMAIL:${v.email}`
      if (v.address) card += `\nADR:;;${v.address};;;;`
      card += '\nEND:VCARD'
      return card
    }
    if (contentType.value === 'wifi') {
      const w = wifiFields.value
      return `WIFI:T:${w.encryption};S:${w.ssid};P:${w.password};;`
    }
    return ''
  })

  async function generate() {
    if (!inputText.value.trim() || !canvasRef.value) return
    try {
      await QRCode.toCanvas(canvasRef.value, inputText.value, {
        width: size.value,
        margin: 2,
        color: {
          dark: fgColor.value,
          light: bgColor.value
        },
        errorCorrectionLevel: errorLevel.value
      })
    } catch {}
  }

  function download() {
    if (!canvasRef.value) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.value.toDataURL('image/png')
    link.click()
  }

  async function copyToClipboard() {
    if (!canvasRef.value) return
    try {
      const blob = await new Promise(resolve => canvasRef.value.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      copied.value = true
      setTimeout(() => { copied.value = false }, 1500)
    } catch {}
  }

  watch([inputText, size, fgColor, bgColor, errorLevel], () => {
    generate()
  })

  return {
    contentType, textContent, urlContent,
    vcardFields, wifiFields,
    size, fgColor, bgColor, errorLevel,
    canvasRef, copied, inputText,
    generate, download, copyToClipboard
  }
}
