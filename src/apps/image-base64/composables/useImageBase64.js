import { ref, computed } from 'vue'

export function useImageBase64() {
  const imageFile = ref(null)
  const imageSrc = ref('')
  const originalWidth = ref(0)
  const originalHeight = ref(0)
  const outputWidth = ref(0)
  const outputHeight = ref(0)
  const keepRatio = ref(true)
  const quality = ref(92)
  const outputFormat = ref('png')
  const base64Result = ref('')
  const isProcessing = ref(false)

  const imageInfo = computed(() => {
    if (!imageFile.value) return null
    const size = imageFile.value.size
    const sizeStr = size < 1024 ? size + ' B'
      : size < 1024 * 1024 ? (size / 1024).toFixed(1) + ' KB'
      : (size / (1024 * 1024)).toFixed(1) + ' MB'
    return {
      fileName: imageFile.value.name,
      format: imageFile.value.type || 'unknown',
      originalWidth: originalWidth.value,
      originalHeight: originalHeight.value,
      fileSize: sizeStr
    }
  })

  const dataUrl = computed(() => {
    if (!base64Result.value) return ''
    const mime = outputFormat.value === 'jpeg' ? 'image/jpeg'
      : outputFormat.value === 'webp' ? 'image/webp'
      : 'image/png'
    return `data:${mime};base64,${base64Result.value}`
  })

  const cssBackground = computed(() => {
    if (!dataUrl.value) return ''
    return `background-image: url('${dataUrl.value}');`
  })

  const htmlImg = computed(() => {
    if (!dataUrl.value) return ''
    return `<img src="${dataUrl.value}" alt="image" />`
  })

  function getMimeType() {
    if (outputFormat.value === 'jpeg') return 'image/jpeg'
    if (outputFormat.value === 'webp') return 'image/webp'
    return 'image/png'
  }

  function processImage() {
    if (!imageSrc.value) return
    isProcessing.value = true
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const w = outputWidth.value || img.width
      const h = outputHeight.value || img.height
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const mime = getMimeType()
      const q = outputFormat.value === 'png' ? undefined : quality.value / 100
      const result = canvas.toDataURL(mime, q)
      base64Result.value = result.split(',')[1] || ''
      isProcessing.value = false
    }
    img.onerror = () => {
      isProcessing.value = false
    }
    img.src = imageSrc.value
  }

  function handleFile(file) {
    if (!file) return
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
      const img = new Image()
      img.onload = () => {
        originalWidth.value = img.width
        originalHeight.value = img.height
        outputWidth.value = img.width
        outputHeight.value = img.height
        processImage()
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  function handlePaste(event) {
    const items = event.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) handleFile(file)
        break
      }
    }
  }

  function updateWidth(val) {
    outputWidth.value = parseInt(val) || 0
    if (keepRatio.value && originalWidth.value > 0) {
      outputHeight.value = Math.round((outputWidth.value / originalWidth.value) * originalHeight.value)
    }
    processImage()
  }

  function updateHeight(val) {
    outputHeight.value = parseInt(val) || 0
    if (keepRatio.value && originalHeight.value > 0) {
      outputWidth.value = Math.round((outputHeight.value / originalHeight.value) * originalWidth.value)
    }
    processImage()
  }

  function clear() {
    imageFile.value = null
    imageSrc.value = ''
    originalWidth.value = 0
    originalHeight.value = 0
    outputWidth.value = 0
    outputHeight.value = 0
    base64Result.value = ''
  }

  return {
    imageFile, imageSrc, imageInfo,
    originalWidth, originalHeight,
    outputWidth, outputHeight, keepRatio,
    quality, outputFormat,
    base64Result, dataUrl, cssBackground, htmlImg,
    isProcessing,
    handleFile, handlePaste, processImage,
    updateWidth, updateHeight, clear
  }
}
