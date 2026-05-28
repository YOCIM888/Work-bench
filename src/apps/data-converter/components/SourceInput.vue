<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  inputText: { type: String, default: '' },
  sourceFormat: { type: String, default: 'json' }
})

const emit = defineEmits(['update:inputText', 'update:sourceFormat', 'autoDetect', 'clear'])

const formats = ['json', 'yaml', 'xml']
</script>

<template>
  <div class="source-input">
    <div class="panel-header">
      <div class="header-left">
        <span class="section-label">{{ t('dataConverter.source') }}</span>
        <select
          :value="sourceFormat"
          @change="$emit('update:sourceFormat', $event.target.value)"
          class="format-select"
        >
          <option v-for="fmt in formats" :key="fmt" :value="fmt">{{ t('dataConverter.' + fmt) }}</option>
        </select>
      </div>
      <div class="header-actions">
        <button class="btn-action" @click="$emit('autoDetect')">{{ t('dataConverter.autoDetect') }}</button>
        <button class="btn-action" @click="$emit('clear')">{{ t('dataConverter.clear') }}</button>
      </div>
    </div>
    <textarea
      :value="inputText"
      @input="$emit('update:inputText', $event.target.value)"
      class="source-textarea"
      :placeholder="t('dataConverter.placeholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style scoped>
.source-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.format-select {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #555;
  outline: none;
  background: #fff;
}
.format-select:focus {
  border-color: #4a90d9;
}
.header-actions {
  display: flex;
  gap: 4px;
}
.btn-action {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-action:hover {
  background: #f0f0f0;
}
.source-textarea {
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
.source-textarea:focus {
  border-color: #4a90d9;
}
.source-textarea::placeholder {
  color: #bbb;
}
</style>
