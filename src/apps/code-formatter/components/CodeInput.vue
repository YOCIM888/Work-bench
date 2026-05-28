<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  indentSize: { type: Number, default: 2 },
  indentType: { type: String, default: 'space' }
})

const emit = defineEmits(['update:modelValue', 'update:language', 'update:indentSize', 'update:indentType', 'format', 'clear'])

const languages = [
  'javascript', 'typescript', 'html', 'css', 'json', 'xml',
  'sql', 'python', 'java', 'cpp', 'go', 'rust', 'php', 'markdown', 'yaml'
]
</script>

<template>
  <div class="code-input">
    <div class="input-toolbar">
      <select class="lang-select" :value="language" @change="$emit('update:language', $event.target.value)">
        <option v-for="lang in languages" :key="lang" :value="lang">{{ t('codeFormatter.languages.' + lang) }}</option>
      </select>
      <div class="indent-controls">
        <span class="indent-label">{{ t('codeFormatter.indent') }}:</span>
        <select class="indent-select" :value="indentType + '-' + indentSize" @change="const v = $event.target.value.split('-'); $emit('update:indentType', v[0]); $emit('update:indentSize', Number(v[1]))">
          <option value="space-2">{{ t('codeFormatter.spaces', { n: 2 }) }}</option>
          <option value="space-4">{{ t('codeFormatter.spaces', { n: 4 }) }}</option>
          <option value="space-8">{{ t('codeFormatter.spaces', { n: 8 }) }}</option>
          <option value="tab-1">{{ t('codeFormatter.tab') }}</option>
        </select>
      </div>
      <button class="btn-format" @click="$emit('format')">{{ t('codeFormatter.format') }}</button>
      <button class="btn-clear" @click="$emit('clear')">{{ t('codeFormatter.clear') }}</button>
    </div>
    <textarea
      class="code-textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="t('codeFormatter.inputPlaceholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style scoped>
.code-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.input-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
}
.lang-select, .indent-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  color: #333;
  outline: none;
  cursor: pointer;
}
.lang-select:focus, .indent-select:focus {
  border-color: #4a90d9;
}
.indent-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.indent-label {
  font-size: 12px;
  color: #888;
}
.btn-format {
  padding: 4px 14px;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-format:hover {
  background: #3a7bc8;
}
.btn-clear {
  padding: 4px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-clear:hover {
  background: #f0f0f0;
}
.code-textarea {
  flex: 1;
  width: 100%;
  border: none;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  outline: none;
  resize: none;
  background: #fafafa;
}
.code-textarea::placeholder {
  color: #bbb;
}
</style>
