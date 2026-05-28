<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  original: { type: String, default: '' },
  modified: { type: String, default: '' }
})

const emit = defineEmits(['update:original', 'update:modified', 'compare', 'clear', 'swap'])
</script>

<template>
  <div class="diff-input">
    <div class="input-panels">
      <div class="input-panel">
        <label class="panel-label">{{ t('diffChecker.original') }}</label>
        <textarea
          class="diff-textarea"
          :value="original"
          @input="$emit('update:original', $event.target.value)"
          :placeholder="t('diffChecker.placeholder')"
          spellcheck="false"
        ></textarea>
      </div>
      <div class="input-panel">
        <label class="panel-label">{{ t('diffChecker.modified') }}</label>
        <textarea
          class="diff-textarea"
          :value="modified"
          @input="$emit('update:modified', $event.target.value)"
          :placeholder="t('diffChecker.placeholder')"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
    <div class="input-actions">
      <button class="btn-primary" @click="$emit('compare')">{{ t('diffChecker.compare') }}</button>
      <button class="btn-secondary" @click="$emit('swap')">{{ t('diffChecker.swap') }}</button>
      <button class="btn-secondary" @click="$emit('clear')">{{ t('diffChecker.clear') }}</button>
    </div>
  </div>
</template>

<style scoped>
.diff-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-panels {
  display: flex;
  gap: 8px;
}
.input-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.panel-label {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.diff-textarea {
  width: 100%;
  height: 140px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  outline: none;
  resize: vertical;
  background: #fafafa;
}
.diff-textarea:focus {
  border-color: #4a90d9;
}
.diff-textarea::placeholder {
  color: #bbb;
}
.input-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn-primary {
  padding: 6px 20px;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover {
  background: #3a7bc8;
}
.btn-secondary {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover {
  background: #f0f0f0;
}
</style>
