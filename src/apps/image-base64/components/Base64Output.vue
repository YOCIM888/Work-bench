<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  base64: { type: String, default: '' },
  dataUrl: { type: String, default: '' },
  cssBackground: { type: String, default: '' },
  htmlImg: { type: String, default: '' }
})

const activeTab = ref('dataUrl')
const copied = ref(false)

const tabs = [
  { id: 'pureBase64', key: 'pureBase64' },
  { id: 'dataUrl', key: 'dataUrl' },
  { id: 'cssBg', key: 'cssBg' },
  { id: 'htmlImg', key: 'htmlImg' }
]

function currentOutput() {
  if (activeTab.value === 'pureBase64') return props.base64
  if (activeTab.value === 'dataUrl') return props.dataUrl
  if (activeTab.value === 'cssBg') return props.cssBackground
  if (activeTab.value === 'htmlImg') return props.htmlImg
  return ''
}

function copyOutput() {
  const text = currentOutput()
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}
</script>

<template>
  <div class="base64-output" v-if="base64">
    <div class="output-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >{{ t('imageBase64.' + tab.key) }}</button>
    </div>
    <div class="output-area">
      <textarea
        :value="currentOutput()"
        class="output-textarea"
        readonly
      ></textarea>
      <div class="output-footer">
        <span class="char-count">{{ t('imageBase64.chars', { count: currentOutput().length }) }}</span>
        <button class="btn-copy" @click="copyOutput">{{ copied ? t('imageBase64.copied') : t('imageBase64.copy') }}</button>
      </div>
    </div>
  </div>
  <div class="no-image" v-else>
    {{ t('imageBase64.noImage') }}
  </div>
</template>

<style scoped>
.base64-output {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.output-tabs {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}
.tab-btn {
  flex: 1;
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: #4a90d9;
  color: #fff;
}
.output-area {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.output-textarea {
  width: 100%;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 11px;
  color: #333;
  outline: none;
  resize: vertical;
  background: #f9f9f9;
  word-break: break-all;
}
.output-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.char-count {
  font-size: 11px;
  color: #aaa;
}
.btn-copy {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
}
.btn-copy:hover {
  background: #f0f0f0;
}
.no-image {
  text-align: center;
  padding: 24px;
  color: #aaa;
  font-size: 13px;
}
</style>
