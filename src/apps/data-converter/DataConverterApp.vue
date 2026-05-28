<script setup>
import { useI18n } from '@/i18n/index.js'
import SourceInput from './components/SourceInput.vue'
import ResultOutput from './components/ResultOutput.vue'
import { useDataConverter } from './composables/useDataConverter.js'

const { t } = useI18n()

const {
  inputText, sourceFormat, targetFormat,
  outputText, error,
  autoDetect, swapFormats, clearAll, download
} = useDataConverter()
</script>

<template>
  <div class="data-converter-app">
    <div class="converter-layout">
      <SourceInput
        :input-text="inputText"
        :source-format="sourceFormat"
        @update:input-text="inputText = $event"
        @update:source-format="sourceFormat = $event"
        @auto-detect="autoDetect"
        @clear="clearAll"
      />
      <div class="swap-column">
        <button class="btn-swap" @click="swapFormats" :title="t('dataConverter.swap')">⇄</button>
      </div>
      <ResultOutput
        :output-text="outputText"
        :target-format="targetFormat"
        :error="error"
        @update:target-format="targetFormat = $event"
        @download="download"
      />
    </div>
  </div>
</template>

<style scoped>
.data-converter-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
}
.converter-layout {
  flex: 1;
  display: flex;
  gap: 4px;
  min-height: 0;
}
.swap-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.btn-swap {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 16px;
  color: #4a90d9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.btn-swap:hover {
  background: #4a90d9;
  color: #fff;
}
</style>
