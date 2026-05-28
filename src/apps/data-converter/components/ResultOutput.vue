<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  outputText: { type: String, default: '' },
  targetFormat: { type: String, default: 'yaml' },
  error: { type: Boolean, default: false }
})

const emit = defineEmits(['update:targetFormat', 'download'])

const copied = ref(false)
const formats = ['json', 'yaml', 'xml']

function copyOutput() {
  if (props.outputText && !props.error) {
    navigator.clipboard.writeText(props.outputText).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1500)
    })
  }
}
</script>

<template>
  <div class="result-output">
    <div class="panel-header">
      <div class="header-left">
        <span class="section-label">{{ t('dataConverter.target') }}</span>
        <select
          :value="targetFormat"
          @change="$emit('update:targetFormat', $event.target.value)"
          class="format-select"
        >
          <option v-for="fmt in formats" :key="fmt" :value="fmt">{{ t('dataConverter.' + fmt) }}</option>
        </select>
      </div>
      <div class="header-actions">
        <button class="btn-action" @click="copyOutput" v-if="outputText && !error">
          {{ copied ? t('dataConverter.copied') : t('dataConverter.copy') }}
        </button>
        <button class="btn-action" @click="$emit('download')" v-if="outputText && !error">
          {{ t('dataConverter.download') }}
        </button>
      </div>
    </div>
    <div class="error-msg" v-if="error">{{ t('dataConverter.error') }}</div>
    <textarea
      v-else
      :value="outputText || ''"
      class="result-textarea"
      readonly
      :placeholder="t('dataConverter.resultPlaceholder')"
    ></textarea>
  </div>
</template>

<style scoped>
.result-output {
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
.error-msg {
  flex: 1;
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.result-textarea {
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
  background: #f9f9f9;
}
.result-textarea::placeholder {
  color: #bbb;
}
</style>
