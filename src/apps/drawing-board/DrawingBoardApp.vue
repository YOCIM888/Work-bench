<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import DrawingToolbar from './components/DrawingToolbar.vue'
import DrawingCanvas from './components/DrawingCanvas.vue'
import { useDrawing } from './composables/useDrawing.js'

const { t } = useI18n()

const {
  tool, color, lineWidth, fillShape,
  PRESET_COLORS,
  initCanvas, startDraw, draw, endDraw,
  undo, redo, clearCanvas, downloadPNG,
  historyIndex, history
} = useDrawing()

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.length - 1)

const confirmClear = ref(false)

function handleClear() {
  confirmClear.value = true
}

function confirmClearYes() {
  clearCanvas()
  confirmClear.value = false
}

function confirmClearNo() {
  confirmClear.value = false
}
</script>

<template>
  <div class="drawing-board-app">
    <DrawingToolbar
      :tool="tool"
      :color="color"
      :line-width="lineWidth"
      :fill-shape="fillShape"
      :preset-colors="PRESET_COLORS"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @update:tool="tool = $event"
      @update:color="color = $event"
      @update:line-width="lineWidth = $event"
      @update:fill-shape="fillShape = $event"
      @undo="undo"
      @redo="redo"
      @clear="handleClear"
      @download="downloadPNG"
    />
    <div class="canvas-container">
      <DrawingCanvas
        :start-draw="startDraw"
        :draw="draw"
        :end-draw="endDraw"
        :init-canvas="initCanvas"
      />
    </div>
    <div class="confirm-overlay" v-if="confirmClear" @click.self="confirmClearNo">
      <div class="confirm-dialog">
        <p>{{ t('drawingBoard.confirmClear') }}</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="confirmClearYes">{{ t('drawingBoard.yes') }}</button>
          <button class="btn-no" @click="confirmClearNo">{{ t('drawingBoard.no') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawing-board-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}
.canvas-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.confirm-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.confirm-dialog {
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.confirm-dialog p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
}
.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-yes {
  padding: 6px 20px;
  border: none;
  border-radius: 4px;
  background: #e74c3c;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.btn-yes:hover {
  background: #c0392b;
}
.btn-no {
  padding: 6px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 13px;
  cursor: pointer;
}
.btn-no:hover {
  background: #f0f0f0;
}
</style>
