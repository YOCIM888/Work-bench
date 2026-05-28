import { ref, reactive } from 'vue'

export function useDrawing() {
  const tool = ref('pen')
  const color = ref('#333333')
  const lineWidth = ref(3)
  const fillShape = ref(false)
  const canvasRef = ref(null)
  const ctx = ref(null)
  const isDrawing = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const history = reactive([])
  const historyIndex = ref(-1)
  const snapshotBeforeShape = ref(null)

  const PRESET_COLORS = [
    '#333333', '#e74c3c', '#e67e22', '#f1c40f',
    '#2ecc71', '#3498db', '#9b59b6', '#1abc9c',
    '#ffffff', '#95a5a6', '#34495e', '#000000'
  ]

  function initCanvas(canvas) {
    canvasRef.value = canvas
    ctx.value = canvas.getContext('2d')
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
    ctx.value.fillStyle = '#ffffff'
    ctx.value.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }

  function saveHistory() {
    if (!canvasRef.value) return
    const imageData = ctx.value.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    if (historyIndex.value < history.length - 1) {
      history.splice(historyIndex.value + 1)
    }
    history.push(imageData)
    historyIndex.value = history.length - 1
    if (history.length > 50) {
      history.shift()
      historyIndex.value--
    }
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      ctx.value.putImageData(history[historyIndex.value], 0, 0)
    }
  }

  function redo() {
    if (historyIndex.value < history.length - 1) {
      historyIndex.value++
      ctx.value.putImageData(history[historyIndex.value], 0, 0)
    }
  }

  function clearCanvas() {
    if (!ctx.value) return
    ctx.value.fillStyle = '#ffffff'
    ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    saveHistory()
  }

  function downloadPNG() {
    if (!canvasRef.value) return
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvasRef.value.toDataURL('image/png')
    link.click()
  }

  function getPos(e) {
    const rect = canvasRef.value.getBoundingClientRect()
    const scaleX = canvasRef.value.width / rect.width
    const scaleY = canvasRef.value.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  function startDraw(e) {
    if (!ctx.value) return
    isDrawing.value = true
    const pos = getPos(e)
    startX.value = pos.x
    startY.value = pos.y

    if (tool.value === 'pen' || tool.value === 'eraser') {
      ctx.value.beginPath()
      ctx.value.moveTo(pos.x, pos.y)
      ctx.value.strokeStyle = tool.value === 'eraser' ? '#ffffff' : color.value
      ctx.value.lineWidth = tool.value === 'eraser' ? lineWidth.value * 3 : lineWidth.value
    } else {
      snapshotBeforeShape.value = ctx.value.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }

  function draw(e) {
    if (!isDrawing.value || !ctx.value) return
    const pos = getPos(e)

    if (tool.value === 'pen' || tool.value === 'eraser') {
      ctx.value.lineTo(pos.x, pos.y)
      ctx.value.stroke()
    } else {
      ctx.value.putImageData(snapshotBeforeShape.value, 0, 0)
      ctx.value.strokeStyle = color.value
      ctx.value.fillStyle = color.value
      ctx.value.lineWidth = lineWidth.value

      if (tool.value === 'line') {
        ctx.value.beginPath()
        ctx.value.moveTo(startX.value, startY.value)
        ctx.value.lineTo(pos.x, pos.y)
        ctx.value.stroke()
      } else if (tool.value === 'rect') {
        const w = pos.x - startX.value
        const h = pos.y - startY.value
        if (fillShape.value) {
          ctx.value.fillRect(startX.value, startY.value, w, h)
        }
        ctx.value.strokeRect(startX.value, startY.value, w, h)
      } else if (tool.value === 'circle') {
        const rx = (pos.x - startX.value) / 2
        const ry = (pos.y - startY.value) / 2
        const cx = startX.value + rx
        const cy = startY.value + ry
        ctx.value.beginPath()
        ctx.value.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI)
        if (fillShape.value) {
          ctx.value.fill()
        }
        ctx.value.stroke()
      }
    }
  }

  function endDraw() {
    if (!isDrawing.value) return
    isDrawing.value = false
    snapshotBeforeShape.value = null
    saveHistory()
  }

  return {
    tool, color, lineWidth, fillShape,
    canvasRef, ctx, isDrawing,
    PRESET_COLORS,
    initCanvas, startDraw, draw, endDraw,
    undo, redo, clearCanvas, downloadPNG,
    historyIndex, history
  }
}
