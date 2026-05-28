<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useBase64 } from '../composables/useBase64.js'

const { t } = useI18n()

const {
  inputText, mode, urlSafe,
  outputText, error,
  inputLength, outputLength,
  swapMode, clearAll
} = useBase64()

const copied = ref(false)

function copyOutput() {
  if (outputText.value && outputText.value !== null) {
    navigator.clipboard.writeText(outputText.value).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1500)
    })
  }
}
</script>

<template>
  <div class="text-codec">
    <div class="controls">
      <div class="mode-toggle">
        <button
          :class="['mode-btn', { active: mode === 'encode' }]"
          @click="mode = 'encode'"
        >{{ t('base64.encode') }}</button>
        <button
          :class="['mode-btn', { active: mode === 'decode' }]"
          @click="mode = 'decode'"
        >{{ t('base64.decode') }}</button>
      </div>
      <label class="url-safe-toggle">
        <input type="checkbox" v-model="urlSafe" />
        {{ t('base64.urlSafe') }}
      </label>
      <button class="btn-action" @click="swapMode">{{ t('base64.swap') }}</button>
      <button class="btn-action" @click="clearAll">{{ t('base64.clear') }}</button>
    </div>
    <div class="codec-panels">
      <div class="panel">
        <div class="panel-header">
          <span>{{ t('base64.input') }}</span>
          <span class="char-count">{{ t('base64.inputChars', { count: inputLength }) }}</span>
        </div>
        <textarea
          v-model="inputText"
          class="codec-textarea"
          :placeholder="mode === 'encode' ? t('base64.textPlaceholder') : t('base64.base64Placeholder')"
          spellcheck="false"
        ></textarea>
      </div>
      <div class="panel">
        <div class="panel-header">
          <span>{{ t('base64.output') }}</span>
          <span class="char-count">{{ t('base64.outputChars', { count: outputLength }) }}</span>
        </div>
        <div class="error-msg" v-if="error">{{ t('base64.error') }}</div>
        <textarea
          v-else
          :value="outputText || ''"
          class="codec-textarea output"
          readonly
          :placeholder="t('base64.output')"
        ></textarea>
        <button
          class="btn-copy"
          v-if="outputText && !error"
          @click="copyOutput"
        >{{ copied ? t('base64.copied') : t('base64.copy') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-codec {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.mode-toggle {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}
.mode-btn {
  padding: 5px 14px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.mode-btn.active {
  background: #4a90d9;
  color: #fff;
}
.url-safe-toggle {
  font-size: 13px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.url-safe-toggle input {
  accent-color: #4a90d9;
}
.btn-action {
  padding: 5px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
}
.btn-action:hover {
  background: #f0f0f0;
}
.codec-panels {
  flex: 1;
  display: flex;
  gap: 8px;
  min-height: 0;
}
.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
  color: #888;
}
.char-count {
  font-size: 11px;
  color: #aaa;
}
.codec-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  outline: none;
  resize: none;
}
.codec-textarea:focus {
  border-color: #4a90d9;
}
.codec-textarea::placeholder {
  color: #bbb;
}
.codec-textarea.output {
  background: #f9f9f9;
}
.error-msg {
  flex: 1;
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.btn-copy {
  margin-top: 6px;
  padding: 5px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  align-self: flex-end;
}
.btn-copy:hover {
  background: #f0f0f0;
}
</style>
