<script setup>
import { ref, computed, onMounted } from 'vue'
import DesktopIcon from './DesktopIcon.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  apps: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['openApp'])

const STORAGE_KEY = 'workbench-icon-order'
const iconOrder = ref([])
const draggedId = ref(null)
const dropTargetId = ref(null)
const dropPosition = ref(null)

function loadOrder() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        iconOrder.value = parsed
        return
      }
    }
  } catch {}
  iconOrder.value = props.apps.map(a => a.id)
}

function saveOrder() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(iconOrder.value))
}

const sortedApps = computed(() => {
  const appMap = {}
  for (const app of props.apps) {
    appMap[app.id] = app
  }
  const result = []
  for (const id of iconOrder.value) {
    if (appMap[id]) {
      result.push(appMap[id])
      delete appMap[id]
    }
  }
  for (const app of props.apps) {
    if (appMap[app.id]) {
      result.push(app)
    }
  }
  return result
})

function resetOrder() {
  iconOrder.value = props.apps.map(a => a.id)
  localStorage.removeItem(STORAGE_KEY)
}

function onDragStart(appId) {
  draggedId.value = appId
}

function onDragEnd() {
  draggedId.value = null
  dropTargetId.value = null
  dropPosition.value = null
}

function onDragOver(event, appId) {
  event.preventDefault()
  if (draggedId.value === appId) return
  dropTargetId.value = appId
  const rect = event.currentTarget.getBoundingClientRect()
  const midX = rect.left + rect.width / 2
  dropPosition.value = event.clientX < midX ? 'before' : 'after'
}

function onDragLeave() {
  dropTargetId.value = null
  dropPosition.value = null
}

function onDrop(event, appId) {
  event.preventDefault()
  if (!draggedId.value || draggedId.value === appId) return
  const fromIndex = iconOrder.value.indexOf(draggedId.value)
  if (fromIndex === -1) return
  iconOrder.value.splice(fromIndex, 1)
  let toIndex = iconOrder.value.indexOf(appId)
  if (toIndex === -1) return
  if (dropPosition.value === 'after') toIndex++
  iconOrder.value.splice(toIndex, 0, draggedId.value)
  saveOrder()
  draggedId.value = null
  dropTargetId.value = null
  dropPosition.value = null
}

onMounted(() => {
  loadOrder()
})
</script>

<template>
  <div class="desktop">
    <DesktopIcon
      v-for="app in sortedApps"
      :key="app.id"
      :app="app"
      :is-dragging="draggedId === app.id"
      :drop-target="dropTargetId === app.id"
      :drop-position="dropPosition"
      @click="emit('openApp', app.id)"
      @dragstart="onDragStart(app.id)"
      @dragend="onDragEnd"
      @dragover="onDragOver($event, app.id)"
      @dragleave="onDragLeave"
      @drop="onDrop($event, app.id)"
    />
    <button class="btn-reset" @click="resetOrder" :title="'Reset order'">↺</button>
  </div>
</template>

<style scoped>
.desktop {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 24px;
  overflow: auto;
  background: var(--bg-desktop);
  position: relative;
}
.btn-reset {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-light);
  border-radius: 50%;
  background: var(--btn-bg);
  font-size: 16px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.btn-reset:hover {
  opacity: 1;
  color: var(--accent-color);
}
</style>
