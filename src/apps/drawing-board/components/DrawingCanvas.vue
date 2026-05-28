<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  startDraw: { type: Function, required: true },
  draw: { type: Function, required: true },
  endDraw: { type: Function, required: true },
  initCanvas: { type: Function, required: true }
})

const canvasEl = ref(null)

onMounted(() => {
  const canvas = canvasEl.value
  const container = canvas.parentElement
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  props.initCanvas(canvas)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const container = canvas.parentElement
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 0)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function onMouseDown(e) {
  e.preventDefault()
  props.startDraw(e)
}

function onMouseMove(e) {
  props.draw(e)
}

function onMouseUp() {
  props.endDraw()
}

function onTouchStart(e) {
  e.preventDefault()
  props.startDraw(e)
}

function onTouchMove(e) {
  e.preventDefault()
  props.draw(e)
}

function onTouchEnd() {
  props.endDraw()
}
</script>

<template>
  <canvas
    ref="canvasEl"
    class="drawing-canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  ></canvas>
</template>

<style scoped>
.drawing-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  background: #fff;
}
</style>
