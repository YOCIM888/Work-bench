<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  error: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'format', 'minify', 'clear'])

const copied = ref(false)

function copyJson() {
  navigator.clipboard.writeText(props.modelValue).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}
</script>

<template>
  <div class="json-input">
    <div class="input-toolbar">
      <button class="btn-action" @click="$emit('format')">{{ t('jsonViewer.format') }}</button>
      <button class="btn-action" @click="$emit('minify')">{{ t('jsonViewer.minify') }}</button>
      <button class="btn-action" @click="copyJson">{{ copied ? t('jsonViewer.copied') : t('jsonViewer.copy') }}</button>
      <button class="btn-action" @click="$emit('clear')">{{ t('jsonViewer.clear') }}</button>
    </div>
    <textarea
      class="json-textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="t('jsonViewer.inputPlaceholder')"
      spellcheck="false"
    ></textarea>
    <div class="error-msg" v-if="error">{{ t('jsonViewer.error') }}: {{ error }}</div>
  </div>
</template>

<style scoped>
.json-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.input-toolbar {
  display: flex;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
}
.btn-action {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-action:hover {
  background: #f0f0f0;
}
.json-textarea {
  flex: 1;
  width: 100%;
  border: none;
  padding: 10px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  outline: none;
  resize: none;
  background: #fafafa;
}
.json-textarea::placeholder {
  color: #bbb;
}
.error-msg {
  padding: 6px 10px;
  font-size: 12px;
  color: #e74c3c;
  background: #fef5f5;
  border-top: 1px solid #f5c6cb;
}
</style>
