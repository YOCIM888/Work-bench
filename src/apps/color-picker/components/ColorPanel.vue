<script setup>
const props = defineProps({
  hue: { type: Number, default: 0 },
  saturation: { type: Number, default: 100 },
  brightness: { type: Number, default: 100 }
})

const emit = defineEmits(['update:hue', 'update:saturation', 'update:brightness'])

let isDraggingPanel = false
let isDraggingHue = false

function onPanelMouseDown(e) {
  isDraggingPanel = true
  updatePanel(e)
  document.addEventListener('mousemove', onPanelMouseMove)
  document.addEventListener('mouseup', onPanelMouseUp)
}

function onPanelMouseMove(e) {
  if (isDraggingPanel) updatePanel(e)
}

function onPanelMouseUp() {
  isDraggingPanel = false
  document.removeEventListener('mousemove', onPanelMouseMove)
  document.removeEventListener('mouseup', onPanelMouseUp)
}

function updatePanel(e) {
  const rect = e.currentTarget.getBoundingClientRect ? e.currentTarget.getBoundingClientRect() : e.target.closest('.color-panel').getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
  emit('update:saturation', Math.round(x * 100))
  emit('update:brightness', Math.round((1 - y) * 100))
}

function onHueMouseDown(e) {
  isDraggingHue = true
  updateHue(e)
  document.addEventListener('mousemove', onHueMouseMove)
  document.addEventListener('mouseup', onHueMouseUp)
}

function onHueMouseMove(e) {
  if (isDraggingHue) updateHue(e)
}

function onHueMouseUp() {
  isDraggingHue = false
  document.removeEventListener('mousemove', onHueMouseMove)
  document.removeEventListener('mouseup', onHueMouseUp)
}

function updateHue(e) {
  const bar = e.target.closest('.hue-bar')
  const rect = bar.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('update:hue', Math.round(x * 360))
}
</script>

<template>
  <div class="color-panel-container">
    <div
      class="color-panel"
      @mousedown.prevent="onPanelMouseDown"
      :style="{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }"
    >
      <div
        class="panel-cursor"
        :style="{
          left: saturation + '%',
          top: (100 - brightness) + '%'
        }"
      ></div>
    </div>
    <div class="hue-bar" @mousedown.prevent="onHueMouseDown">
      <div
        class="hue-cursor"
        :style="{ left: (hue / 360 * 100) + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.color-panel-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.color-panel {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 8px;
  cursor: crosshair;
  border: 1px solid #e0e0e0;
}
.panel-cursor {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.hue-bar {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  cursor: pointer;
  border: 1px solid #e0e0e0;
}
.hue-cursor {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #999;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
