<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useUrlCodec } from '../composables/useUrlCodec.js'

const { t } = useI18n()

const {
  inputText, mode, fullEncode,
  outputText, error,
  swapMode, clearAll
} = useUrlCodec()

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
  <div class="encode-decode">
    <div class="controls">
      <div class="mode-toggle">
        <button
          :class="['mode-btn', { active: mode === 'encode' }]"
          @click="mode = 'encode'"
        >{{ t('urlCodec.encode') }}</button>
        <button
          :class="['mode-btn', { active: mode === 'decode' }]"
          @click="mode = 'decode'"
        >{{ t('urlCodec.decode') }}</button>
      </div>
      <label class="full-encode-toggle">
        <input type="checkbox" v-model="fullEncode" />
        {{ t('urlCodec.fullEncode') }}
      </label>
      <span class="encode-hint">
        {{ fullEncode ? t('urlCodec.fullEncodeHint') : t('urlCodec.partialEncodeHint') }}
      </span>
      <button class="btn-action" @click="swapMode">{{ t('urlCodec.swap') }}</button>
      <button class="btn-action" @click="clearAll">{{ t('urlCodec.clear') }}</button>
    </div>
    <div class="codec-panels">
      <div class="panel">
        <div class="panel-header">
          <span>{{ t('urlCodec.input') }}</span>
        </div>
        <textarea
          v-model="inputText"
          class="codec-textarea"
          :placeholder="mode === 'encode' ? t('urlCodec.inputPlaceholder') : t('urlCodec.decodePlaceholder')"
          spellcheck="false"
        ></textarea>
      </div>
      <div class="panel">
        <div class="panel-header">
          <span>{{ t('urlCodec.output') }}</span>
        </div>
        <div class="error-msg" v-if="error">{{ t('urlCodec.error') }}</div>
        <textarea
          v-else
          :value="outputText || ''"
          class="codec-textarea output"
          readonly
          :placeholder="t('urlCodec.output')"
        ></textarea>
        <button
          class="btn-copy"
          v-if="outputText && !error"
          @click="copyOutput"
        >{{ copied ? t('urlCodec.copied') : t('urlCodec.copy') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.encode-decode {
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
.full-encode-toggle {
  font-size: 13px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.full-encode-toggle input {
  accent-color: #4a90d9;
}
.encode-hint {
  font-size: 11px;
  color: #aaa;
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
