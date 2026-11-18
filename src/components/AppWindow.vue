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
import UuidApp from '@/apps/uuid/UuidApp.vue'
import HtmlEntityApp from '@/apps/html-entity/HtmlEntityApp.vue'
import JwtDecodeApp from '@/apps/jwt-decode/JwtDecodeApp.vue'
import TextCountApp from '@/apps/text-count/TextCountApp.vue'
import TextCaseApp from '@/apps/text-case/TextCaseApp.vue'
import CsvJsonApp from '@/apps/csv-json/CsvJsonApp.vue'
import HttpStatusApp from '@/apps/http-status/HttpStatusApp.vue'
import LoremApp from '@/apps/lorem/LoremApp.vue'
import ImageCompressApp from '@/apps/image-compress/ImageCompressApp.vue'
import GradientApp from '@/apps/gradient/GradientApp.vue'
import PxRemApp from '@/apps/px-rem/PxRemApp.vue'
import UnitConverterApp from '@/apps/unit-converter/UnitConverterApp.vue'
import MorseApp from '@/apps/morse/MorseApp.vue'
import AgeCalculatorApp from '@/apps/age-calculator/AgeCalculatorApp.vue'
import StopwatchApp from '@/apps/stopwatch/StopwatchApp.vue'
import TextCleanApp from '@/apps/text-clean/TextCleanApp.vue'
import AsciiTableApp from '@/apps/ascii-table/AsciiTableApp.vue'
import CharFrequencyApp from '@/apps/char-frequency/CharFrequencyApp.vue'
import RandomNumberApp from '@/apps/random-number/RandomNumberApp.vue'
import WorldClockApp from '@/apps/world-clock/WorldClockApp.vue'
import BmiApp from '@/apps/bmi/BmiApp.vue'

const { t } = useI18n()

let zIndex = 100

const props = defineProps({
  window: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'restore', 'focus'])

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
    'qrcode': QrcodeApp,
    'uuid': UuidApp,
    'html-entity': HtmlEntityApp,
    'jwt-decode': JwtDecodeApp,
    'text-count': TextCountApp,
    'text-case': TextCaseApp,
    'csv-json': CsvJsonApp,
    'http-status': HttpStatusApp,
    'lorem': LoremApp,
    'image-compress': ImageCompressApp,
    'gradient': GradientApp,
    'px-rem': PxRemApp,
    'unit-converter': UnitConverterApp,
    'morse': MorseApp,
    'age-calculator': AgeCalculatorApp,
    'stopwatch': StopwatchApp,
    'text-clean': TextCleanApp,
    'ascii-table': AsciiTableApp,
    'char-frequency': CharFrequencyApp,
    'random-number': RandomNumberApp,
    'world-clock': WorldClockApp,
    'bmi': BmiApp
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
      height: 'calc(100vh - var(--taskbar-height))',
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
  emit('focus', props.window.id)
}

function startDrag(e) {
  if (props.window.maximized) return
  // 如果点击的是窗口控制按钮，不启动拖动，也不能阻止默认行为
  // 否则移动端不会合成 click 事件，三个按钮将无法点击
  if (e.target.closest('.window-controls')) return
  // 仅在真正拖动标题栏时阻止页面滚动
  if (e.type === 'touchstart' && typeof e.preventDefault === 'function') e.preventDefault()
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  dragOffsetX.value = clientX - props.window.x
  dragOffsetY.value = clientY - props.window.y
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onMouseMove(e) {
  if (!isDragging.value) return
  props.window.x = e.clientX - dragOffsetX.value
  props.window.y = e.clientY - dragOffsetY.value
}

function onTouchMove(e) {
  if (!isDragging.value) return
  e.preventDefault()
  props.window.x = e.touches[0].clientX - dragOffsetX.value
  props.window.y = e.touches[0].clientY - dragOffsetY.value
}

function onTouchEnd() {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
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
    @touchstart="bringToFront"
    v-show="!window.minimized"
  >
    <div class="window-titlebar" @mousedown.prevent="startDrag" @touchstart="startDrag">
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

/* 移动端响应式 */
@media (max-width: 768px) {
  .window-titlebar {
    height: 40px;
    padding: 0 8px;
  }
  .window-controls button {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  .window-title {
    font-size: 12px;
  }
}
</style>
