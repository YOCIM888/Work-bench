<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  wordCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue'])

const textareaRef = ref(null)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

defineExpose({ textareaRef })
</script>

<template>
  <div class="markdown-input">
    <textarea
      ref="textareaRef"
      class="md-textarea"
      :value="modelValue"
      @input="onInput"
      :placeholder="t('markdownEditor.placeholder')"
      spellcheck="false"
    ></textarea>
    <div class="input-footer">
      <span class="word-count">{{ t('markdownEditor.wordCount', { count: wordCount }) }}</span>
    </div>
  </div>
</template>

<style scoped>
.markdown-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.md-textarea {
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
.md-textarea::placeholder {
  color: #bbb;
}
.input-footer {
  padding: 4px 12px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}
.word-count {
  font-size: 11px;
  color: #aaa;
}
</style>
