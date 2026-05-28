<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  code: { type: String, default: '' },
  extension: { type: String, default: 'txt' }
})

const copied = ref(false)

function copyCode() {
  if (!props.code) return
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function downloadCode() {
  if (!props.code) return
  const blob = new Blob([props.code], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'formatted.' + props.extension
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="code-output">
    <div class="output-toolbar">
      <button class="btn-copy" @click="copyCode">{{ copied ? t('codeFormatter.copied') : t('codeFormatter.copy') }}</button>
      <button class="btn-download" @click="downloadCode">{{ t('codeFormatter.download') }}</button>
    </div>
    <textarea
      class="output-textarea"
      :value="code"
      readonly
      :placeholder="t('codeFormatter.outputPlaceholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<style scoped>
.code-output {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.output-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e5e5;
}
.btn-copy, .btn-download {
  padding: 4px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-copy:hover, .btn-download:hover {
  background: #f0f0f0;
}
.output-textarea {
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
  background: #fff;
}
.output-textarea::placeholder {
  color: #bbb;
}
</style>
