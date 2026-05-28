<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  formats: { type: Array, default: () => [] },
  error: { type: String, default: null }
})

const copiedIndex = ref(-1)

function copyValue(value, index) {
  const text = typeof value === 'object' ? t('timestampConverter.' + value.key, value.args) : value
  navigator.clipboard.writeText(text).then(() => {
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 1500)
  })
}

function getDisplayValue(item) {
  if (item.label === 'relativeTime') {
    return t('timestampConverter.' + item.value.key, item.value.args)
  }
  return item.value
}
</script>

<template>
  <div class="conversion-result">
    <div class="error-msg" v-if="error">{{ error }}</div>
    <div class="format-list" v-else-if="formats.length">
      <div
        v-for="(item, index) in formats"
        :key="item.label"
        class="format-row"
      >
        <span class="format-label">{{ t('timestampConverter.' + item.label) }}</span>
        <span class="format-value">{{ getDisplayValue(item) }}</span>
        <button
          class="copy-btn"
          @click="copyValue(item.value, index)"
        >
          {{ copiedIndex === index ? t('timestampConverter.copied') : t('timestampConverter.copy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversion-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.error-msg {
  padding: 8px 12px;
  color: #e74c3c;
  background: #fef5f5;
  border-radius: 6px;
  font-size: 13px;
}
.format-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.format-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #f9f9f9;
  transition: background 0.15s;
}
.format-row:hover {
  background: #f0f0f0;
}
.format-label {
  font-size: 12px;
  font-weight: 500;
  color: #888;
  min-width: 120px;
  flex-shrink: 0;
}
.format-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  word-break: break-all;
  min-width: 0;
}
.copy-btn {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.copy-btn:hover {
  background: #f0f0f0;
}
</style>
