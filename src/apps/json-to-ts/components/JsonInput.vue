<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  inputJson: { type: String, default: '' }
})

const emit = defineEmits(['update:inputJson', 'sample', 'clear'])
</script>

<template>
  <div class="json-input">
    <div class="input-header">
      <span class="section-label">{{ t('jsonToTs.input') }}</span>
      <div class="input-actions">
        <button class="btn-action" @click="$emit('sample')">{{ t('jsonToTs.sample') }}</button>
        <button class="btn-action" @click="$emit('clear')">{{ t('jsonToTs.clear') }}</button>
      </div>
    </div>
    <textarea
      :value="inputJson"
      @input="$emit('update:inputJson', $event.target.value)"
      class="json-textarea"
      :placeholder="t('jsonToTs.placeholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style scoped>
.json-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.input-actions {
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
.json-textarea {
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
.json-textarea:focus {
  border-color: #4a90d9;
}
.json-textarea::placeholder {
  color: #bbb;
}
</style>
