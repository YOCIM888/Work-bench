<script setup>
import { reactive, ref, provide } from 'vue'
import { createI18n } from './i18n/index.js'
import { useTheme } from './composables/useTheme.js'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Desktop from './components/Desktop.vue'
import AppWindow from './components/AppWindow.vue'
import AppToast from './components/AppToast.vue'

const i18n = createI18n()
const { isDark, toggleTheme, initTheme } = useTheme()

provide('theme', { isDark, toggleTheme })
initTheme()

const apps = [
  { id: 'notepad', nameKey: 'desktop.notepad', icon: '/icon/notepad.svg' },
  { id: 'markdown-editor', nameKey: 'desktop.markdownEditor', icon: '/icon/markdown-editor.svg' },
  { id: 'code-formatter', nameKey: 'desktop.codeFormatter', icon: '/icon/code-formatter.svg' },
  { id: 'regex-tester', nameKey: 'desktop.regexTester', icon: '/icon/regex-tester.svg' },
  { id: 'json-to-ts', nameKey: 'desktop.jsonToTs', icon: '/icon/json-to-ts.svg' },
  { id: 'diff-checker', nameKey: 'desktop.diffChecker', icon: '/icon/diff-checker.svg' },
  { id: 'json-viewer', nameKey: 'desktop.jsonViewer', icon: '/icon/json-viewer.svg' },
  { id: 'data-converter', nameKey: 'desktop.dataConverter', icon: '/icon/data-converter.svg' },
  { id: 'radix-converter', nameKey: 'desktop.radixConverter', icon: '/icon/radix-converter.svg' },
  { id: 'base64', nameKey: 'desktop.base64', icon: '/icon/base64.svg' },
  { id: 'url-codec', nameKey: 'desktop.urlCodec', icon: '/icon/url-codec.svg' },
  { id: 'image-base64', nameKey: 'desktop.imageBase64', icon: '/icon/image-base64.svg' },
  { id: 'qrcode', nameKey: 'desktop.qrcode', icon: '/icon/qrcode.svg' },
  { id: 'domain-lookup', nameKey: 'desktop.domainLookup', icon: '/icon/domain-lookup.svg' },
  { id: 'cron-generator', nameKey: 'desktop.cronGenerator', icon: '/icon/cron-generator.svg' },
  { id: 'color-picker', nameKey: 'desktop.colorPicker', icon: '/icon/color-picker.svg' },
  { id: 'drawing-board', nameKey: 'desktop.drawingBoard', icon: '/icon/drawing-board.svg' },
  { id: 'password-generator', nameKey: 'desktop.passwordGenerator', icon: '/icon/password-generator.svg' },
  { id: 'timestamp-converter', nameKey: 'desktop.timestampConverter', icon: '/icon/timestamp-converter.svg' },
  { id: 'pomodoro', nameKey: 'desktop.pomodoro', icon: '/icon/pomodoro.svg' },
  { id: 'uuid', nameKey: 'desktop.uuid', icon: '/icon/uuid.svg' },
  { id: 'html-entity', nameKey: 'desktop.htmlEntity', icon: '/icon/html-entity.svg' },
  { id: 'jwt-decode', nameKey: 'desktop.jwtDecode', icon: '/icon/jwt-decode.svg' },
  { id: 'text-count', nameKey: 'desktop.textCount', icon: '/icon/text-count.svg' },
  { id: 'text-case', nameKey: 'desktop.textCase', icon: '/icon/text-case.svg' },
  { id: 'csv-json', nameKey: 'desktop.csvJson', icon: '/icon/csv-json.svg' },
  { id: 'http-status', nameKey: 'desktop.httpStatus', icon: '/icon/http-status.svg' },
  { id: 'lorem', nameKey: 'desktop.lorem', icon: '/icon/lorem.svg' },
  { id: 'image-compress', nameKey: 'desktop.imageCompress', icon: '/icon/image-compress.svg' },
  { id: 'gradient', nameKey: 'desktop.gradient', icon: '/icon/gradient.svg' },
  { id: 'px-rem', nameKey: 'desktop.pxRem', icon: '/icon/px-rem.svg' },
  { id: 'unit-converter', nameKey: 'desktop.unitConverter', icon: '/icon/unit-converter.svg' },
  { id: 'morse', nameKey: 'desktop.morse', icon: '/icon/morse.svg' },
  { id: 'age-calculator', nameKey: 'desktop.ageCalculator', icon: '/icon/age-calculator.svg' },
  { id: 'stopwatch', nameKey: 'desktop.stopwatch', icon: '/icon/stopwatch.svg' },
  { id: 'text-clean', nameKey: 'desktop.textClean', icon: '/icon/text-clean.svg' },
  { id: 'ascii-table', nameKey: 'desktop.asciiTable', icon: '/icon/ascii-table.svg' },
  { id: 'char-frequency', nameKey: 'desktop.charFrequency', icon: '/icon/char-frequency.svg' },
  { id: 'random-number', nameKey: 'desktop.randomNumber', icon: '/icon/random-number.svg' },
  { id: 'world-clock', nameKey: 'desktop.worldClock', icon: '/icon/world-clock.svg' },
  { id: 'bmi', nameKey: 'desktop.bmi', icon: '/icon/bmi.svg' }
]

const openWindows = reactive([])
let nextWindowId = 1
const activeWindowId = ref(null)

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

function getDefaultWindowSize() {
  if (isMobile()) {
    return { width: window.innerWidth - 16, height: window.innerHeight - 100 }
  }
  return { width: 700, height: 500 }
}

function getDefaultWindowPos(winCount) {
  if (isMobile()) {
    return { x: 8, y: 40 + (winCount * 8) }
  }
  return { x: 100 + (winCount * 30), y: 80 + (winCount * 30) }
}

function openApp(appId) {
  const app = apps.find(a => a.id === appId)
  if (!app) return
  const size = getDefaultWindowSize()
  const pos = getDefaultWindowPos(openWindows.length)
  const newWin = {
    id: nextWindowId++,
    appId: app.id,
    titleKey: app.nameKey,
    icon: app.icon,
    minimized: false,
    maximized: isMobile(),
    x: pos.x,
    y: pos.y,
    width: size.width,
    height: size.height
  }
  openWindows.push(newWin)
  activeWindowId.value = newWin.id
}

function closeWindow(id) {
  const index = openWindows.findIndex(w => w.id === id)
  if (index !== -1) {
    openWindows.splice(index, 1)
    if (activeWindowId.value === id) {
      activeWindowId.value = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null
    }
  }
}

function minimizeWindow(id) {
  const win = openWindows.find(w => w.id === id)
  if (win) {
    win.minimized = true
    if (activeWindowId.value === id) {
      // 找下一个未最小化的窗口作为活动窗口
      const nextActive = openWindows.filter(w => !w.minimized && w.id !== id).pop()
      activeWindowId.value = nextActive ? nextActive.id : null
    }
  }
}

function maximizeWindow(id) {
  const win = openWindows.find(w => w.id === id)
  if (win) win.maximized = true
}

function restoreWindow(id) {
  const win = openWindows.find(w => w.id === id)
  if (win) {
    win.minimized = false
    win.maximized = false
  }
  activeWindowId.value = id
}

function focusWindow(id) {
  activeWindowId.value = id
  const win = openWindows.find(w => w.id === id)
  if (win && win.minimized) {
    win.minimized = false
  }
}

function onWindowFocus(id) {
  activeWindowId.value = id
}
</script>

<template>
  <AppHeader />
  <Desktop :apps="apps" @open-app="openApp" class="work-area" />
  <AppWindow
    v-for="win in openWindows"
    :key="win.id"
    :window="win"
    :is-active="activeWindowId === win.id"
    @close="closeWindow"
    @minimize="minimizeWindow"
    @maximize="maximizeWindow"
    @restore="restoreWindow"
    @focus="onWindowFocus"
  />
  <AppFooter
    :open-windows="openWindows"
    :active-window-id="activeWindowId"
    @restore="restoreWindow"
    @focus="focusWindow"
    @minimize="minimizeWindow"
  />
  <AppToast />
</template>
