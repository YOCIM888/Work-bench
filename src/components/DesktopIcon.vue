<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  app: {
    type: Object,
    required: true
  },
  isDragging: {
    type: Boolean,
    default: false
  },
  dropTarget: {
    type: Boolean,
    default: false
  },
  dropPosition: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['dragstart', 'dragend', 'dragover', 'dragleave', 'drop'])

function handleDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  emit('dragstart')
}

function handleDragOver(e) {
  emit('dragover', e)
}

function handleDrop(e) {
  emit('drop', e)
}
</script>

<template>
  <div
    class="desktop-icon"
    :class="{
      dragging: isDragging,
      'drop-before': dropTarget && dropPosition === 'before',
      'drop-after': dropTarget && dropPosition === 'after'
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="emit('dragend')"
    @dragover="handleDragOver"
    @dragleave="emit('dragleave')"
    @drop="handleDrop"
  >
    <div class="icon-image">
      <img :src="app.icon" :alt="t(app.nameKey)" />
    </div>
    <span class="icon-name">{{ t(app.nameKey) }}</span>
  </div>
</template>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s, opacity 0.2s;
  user-select: none;
}
.desktop-icon:hover {
  background: var(--bg-hover);
}
.desktop-icon.dragging {
  opacity: 0.4;
}
.desktop-icon.drop-before {
  position: relative;
}
.desktop-icon.drop-before::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--accent-color);
  border-radius: 2px;
}
.desktop-icon.drop-after {
  position: relative;
}
.desktop-icon.drop-after::after {
  content: '';
  position: absolute;
  right: -12px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--accent-color);
  border-radius: 2px;
}
.icon-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-bg);
  box-shadow: 0 1px 3px var(--shadow-color);
  pointer-events: none;
}
.icon-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.icon-name {
  font-size: 12px;
  color: var(--text-primary);
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
  pointer-events: none;
}
</style>
