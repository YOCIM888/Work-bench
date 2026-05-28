<script setup>
import { reactive, provide } from 'vue'
import { createI18n } from './i18n/index.js'
import { useTheme } from './composables/useTheme.js'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Desktop from './components/Desktop.vue'
import AppWindow from './components/AppWindow.vue'

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
  { id: 'pomodoro', nameKey: 'desktop.pomodoro', icon: '/icon/pomodoro.svg' }
]

const openWindows = reactive([])
let nextWindowId = 1

function openApp(appId) {
  const app = apps.find(a => a.id === appId)
  if (!app) return
  openWindows.push({
    id: nextWindowId++,
    appId: app.id,
    titleKey: app.nameKey,
    minimized: false,
    maximized: false,
    x: 100 + (openWindows.length * 30),
    y: 80 + (openWindows.length * 30),
    width: 700,
    height: 500
  })
}

function closeWindow(id) {
  const index = openWindows.findIndex(w => w.id === id)
  if (index !== -1) openWindows.splice(index, 1)
}

function minimizeWindow(id) {
  const win = openWindows.find(w => w.id === id)
  if (win) win.minimized = true
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
}
</script>

<template>
  <AppHeader />
  <Desktop :apps="apps" @open-app="openApp" class="work-area" />
  <AppWindow
    v-for="win in openWindows"
    :key="win.id"
    :window="win"
    @close="closeWindow"
    @minimize="minimizeWindow"
    @maximize="maximizeWindow"
    @restore="restoreWindow"
  />
  <AppFooter :open-windows="openWindows" @restore="restoreWindow" />
</template>
