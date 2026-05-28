<script setup>
import { ref } from 'vue'
import DiffInput from './components/DiffInput.vue'
import DiffResult from './components/DiffResult.vue'
import DiffStats from './components/DiffStats.vue'
import { useDiff } from './composables/useDiff.js'

const {
  originalText, modifiedText, viewMode,
  sideBySideLines, unifiedLines, stats,
  swapTexts, clearAll
} = useDiff()

const showResult = ref(false)

function handleCompare() {
  showResult.value = true
}

function handleClear() {
  clearAll()
  showResult.value = false
}
</script>

<template>
  <div class="diff-checker-app">
    <DiffInput
      :original="originalText"
      :modified="modifiedText"
      @update:original="originalText = $event"
      @update:modified="modifiedText = $event"
      @compare="handleCompare"
      @swap="swapTexts"
      @clear="handleClear"
    />
    <DiffResult
      v-if="showResult"
      :side-by-side-lines="sideBySideLines"
      :unified-lines="unifiedLines"
      :view-mode="viewMode"
      :has-diff="stats.added > 0 || stats.removed > 0 || (originalText.length > 0 || modifiedText.length > 0)"
      @update:view-mode="viewMode = $event"
      class="result-area"
    />
    <DiffStats :stats="stats" />
  </div>
</template>

<style scoped>
.diff-checker-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 12px;
}
.result-area {
  flex: 1;
  min-height: 0;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
}
</style>
