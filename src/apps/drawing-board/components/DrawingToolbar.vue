<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  tool: { type: String, default: 'pen' },
  color: { type: String, default: '#333333' },
  lineWidth: { type: Number, default: 3 },
  fillShape: { type: Boolean, default: false },
  presetColors: { type: Array, default: () => [] },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false }
})

const emit = defineEmits([
  'update:tool', 'update:color', 'update:lineWidth', 'update:fillShape',
  'undo', 'redo', 'clear', 'download'
])

const tools = [
  { id: 'pen', icon: '✏️' },
  { id: 'eraser', icon: '🧹' },
  { id: 'line', icon: '╱' },
  { id: 'rect', icon: '▭' },
  { id: 'circle', icon: '◯' }
]

const sizes = [
  { id: 'thin', value: 2 },
  { id: 'medium', value: 5 },
  { id: 'thick', value: 10 }
]
</script>

<template>
  <div class="drawing-toolbar">
    <div class="tool-section">
      <div class="tool-group">
        <button
          v-for="t in tools"
          :key="t.id"
          :class="['tool-btn', { active: tool === t.id }]"
          @click="$emit('update:tool', t.id)"
          :title="t.id"
        >{{ t.icon }}</button>
      </div>
    </div>

    <div class="tool-section">
      <div class="color-grid">
        <button
          v-for="c in presetColors"
          :key="c"
          :class="['color-btn', { active: color === c }]"
          :style="{ background: c }"
          @click="$emit('update:color', c)"
        ></button>
      </div>
      <input
        type="color"
        :value="color"
        @input="$emit('update:color', $event.target.value)"
        class="color-picker"
      />
    </div>

    <div class="tool-section">
      <div class="size-group">
        <button
          v-for="s in sizes"
          :key="s.id"
          :class="['size-btn', { active: lineWidth === s.value }]"
          @click="$emit('update:lineWidth', s.value)"
        >{{ t('drawingBoard.' + s.id) }}</button>
      </div>
    </div>

    <div class="tool-section" v-if="tool === 'rect' || tool === 'circle'">
      <label class="fill-toggle">
        <input type="checkbox" :checked="fillShape" @change="$emit('update:fillShape', $event.target.checked)" />
        {{ t('drawingBoard.fill') }}
      </label>
    </div>

    <div class="tool-section actions">
      <button class="action-btn" @click="$emit('undo')" :disabled="!canUndo" :title="t('drawingBoard.undo')">↶</button>
      <button class="action-btn" @click="$emit('redo')" :disabled="!canRedo" :title="t('drawingBoard.redo')">↷</button>
      <button class="action-btn" @click="$emit('clear')" :title="t('drawingBoard.clear')">🗑</button>
      <button class="action-btn" @click="$emit('download')" :title="t('drawingBoard.download')">💾</button>
    </div>
  </div>
</template>

<style scoped>
.drawing-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
}
.tool-section {
  display: flex;
  align-items: center;
  gap: 4px;
}
.tool-section.actions {
  margin-left: auto;
}
.tool-group {
  display: flex;
  gap: 2px;
}
.tool-btn {
  width: 32px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.tool-btn:hover {
  background: #e8e8e8;
}
.tool-btn.active {
  background: #4a90d9;
  border-color: #4a90d9;
}
.color-grid {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}
.color-btn {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.color-btn:hover {
  border-color: #999;
}
.color-btn.active {
  border-color: #333;
}
.color-picker {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
  background: none;
}
.size-group {
  display: flex;
  gap: 2px;
}
.size-btn {
  padding: 3px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.size-btn:hover {
  background: #e8e8e8;
}
.size-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.fill-toggle {
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.fill-toggle input {
  accent-color: #4a90d9;
}
.action-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.action-btn:hover:not(:disabled) {
  background: #f0f0f0;
}
.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
