<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n/index.js'
import NotepadApp from '@/apps/notepad/NotepadApp.vue'
import CodeFormatterApp from '@/apps/code-formatter/CodeFormatterApp.vue'
import ColorPickerApp from '@/apps/color-picker/ColorPickerApp.vue'
import RegexTesterApp from '@/apps/regex-tester/RegexTesterApp.vue'
import MarkdownEditorApp from '@/apps/markdown-editor/MarkdownEditorApp.vue'
import JsonViewerApp from '@/apps/json-viewer/JsonViewerApp.vue'
import DiffCheckerApp from '@/apps/diff-checker/DiffCheckerApp.vue'
import TimestampConverterApp from '@/apps/timestamp-converter/TimestampConverterApp.vue'
import PasswordGeneratorApp from '@/apps/password-generator/PasswordGeneratorApp.vue'
import Base64App from '@/apps/base64/Base64App.vue'
import PomodoroApp from '@/apps/pomodoro/PomodoroApp.vue'
import DrawingBoardApp from '@/apps/drawing-board/DrawingBoardApp.vue'
import UrlCodecApp from '@/apps/url-codec/UrlCodecApp.vue'
import CronGeneratorApp from '@/apps/cron-generator/CronGeneratorApp.vue'
import ImageBase64App from '@/apps/image-base64/ImageBase64App.vue'
import JsonToTsApp from '@/apps/json-to-ts/JsonToTsApp.vue'
import DomainLookupApp from '@/apps/domain-lookup/DomainLookupApp.vue'
import DataConverterApp from '@/apps/data-converter/DataConverterApp.vue'
import RadixConverterApp from '@/apps/radix-converter/RadixConverterApp.vue'
import QrcodeApp from '@/apps/qrcode/QrcodeApp.vue'

const { t } = useI18n()

let zIndex = 100

const props = defineProps({
  window: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'restore'])

const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
const currentZ = ref(zIndex++)

const appComponent = computed(() => {
  const map = {
    notepad: NotepadApp,
    'code-formatter': CodeFormatterApp,
    'color-picker': ColorPickerApp,
    'regex-tester': RegexTesterApp,
    'markdown-editor': MarkdownEditorApp,
    'json-viewer': JsonViewerApp,
    'diff-checker': DiffCheckerApp,
    'timestamp-converter': TimestampConverterApp,
    'password-generator': PasswordGeneratorApp,
    'base64': Base64App,
    'pomodoro': PomodoroApp,
    'drawing-board': DrawingBoardApp,
    'url-codec': UrlCodecApp,
    'cron-generator': CronGeneratorApp,
    'image-base64': ImageBase64App,
    'json-to-ts': JsonToTsApp,
    'domain-lookup': DomainLookupApp,
    'data-converter': DataConverterApp,
    'radix-converter': RadixConverterApp,
    'qrcode': QrcodeApp
  }
  return map[props.window.appId] || null
})

const windowStyle = computed(() => {
  if (props.window.maximized) {
    return {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '100vw',
      height: 'calc(100vh - 52px - 36px)',
      zIndex: currentZ.value
    }
  }
  if (props.window.minimized) {
    return {
      display: 'none'
    }
  }
  return {
    position: 'fixed',
    left: props.window.x + 'px',
    top: props.window.y + 'px',
    width: props.window.width + 'px',
    height: props.window.height + 'px',
    zIndex: currentZ.value
  }
})

function bringToFront() {
  currentZ.value = zIndex++
}

function startDrag(e) {
  if (props.window.maximized) return
  isDragging.value = true
  dragOffsetX.value = e.clientX - props.window.x
  dragOffsetY.value = e.clientY - props.window.y
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  if (!isDragging.value) return
  props.window.x = e.clientX - dragOffsetX.value
  props.window.y = e.clientY - dragOffsetY.value
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div
    class="app-window"
    :class="{ maximized: window.maximized }"
    :style="windowStyle"
    @mousedown="bringToFront"
    v-show="!window.minimized"
  >
    <div class="window-titlebar" @mousedown.prevent="startDrag">
      <span class="window-title">{{ t(window.titleKey) }}</span>
      <div class="window-controls">
        <button class="btn-minimize" @click.stop="$emit('minimize', window.id)">─</button>
        <button class="btn-maximize" @click.stop="window.maximized ? $emit('restore', window.id) : $emit('maximize', window.id)">□</button>
        <button class="btn-close" @click.stop="$emit('close', window.id)">✕</button>
      </div>
    </div>
    <div class="window-body">
      <component :is="appComponent" />
    </div>
  </div>
</template>

<style scoped>
.app-window {
  position: fixed;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 4px 24px var(--shadow-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
.app-window.maximized {
  border-radius: 0;
  transition: all 0.2s;
}
.window-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 36px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  cursor: move;
  user-select: none;
  flex-shrink: 0;
}
.window-title {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}
.window-controls {
  display: flex;
  gap: 4px;
}
.window-controls button {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: background 0.15s;
}
.window-controls button:hover {
  background: var(--bg-hover);
}
.btn-close:hover {
  background: #e81123 !important;
  color: #fff !important;
}
.window-body {
  flex: 1;
  overflow: auto;
  position: relative;
}
</style>
