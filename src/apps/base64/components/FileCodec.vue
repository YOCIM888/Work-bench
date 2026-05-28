<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useBase64 } from '../composables/useBase64.js'

const { t } = useI18n()

const {
  urlSafe, encodeFile, decodeToFile
} = useBase64()

const fileMode = ref('encode')
const selectedFile = ref(null)
const fileBase64 = ref('')
const decodeInput = ref('')
const decodeFileName = ref('')
const fileInfo = ref('')
const copied = ref(false)
const isProcessing = ref(false)

async function handleFileSelect(event) {
  const file = event.target.files?.[0] || null
  if (!file) return
  selectedFile.value = file
  const size = file.size
  const sizeStr = size < 1024 ? size + ' B'
    : size < 1024 * 1024 ? (size / 1024).toFixed(1) + ' KB'
    : (size / (1024 * 1024)).toFixed(1) + ' MB'
  fileInfo.value = `${file.name} (${sizeStr})`
  isProcessing.value = true
  try {
    fileBase64.value = await encodeFile(file)
  } catch {
    fileBase64.value = 'Error encoding file'
  }
  isProcessing.value = false
}

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files?.[0]
  if (file) {
    handleFileSelect({ target: { files: [file] } })
  }
}

function handleDragOver(e) {
  e.preventDefault()
}

function handleDecode() {
  if (!decodeInput.value) return
  try {
    decodeToFile(decodeInput.value, decodeFileName.value || 'decoded-file')
  } catch {
    alert(t('base64.error'))
  }
}

function copyBase64() {
  navigator.clipboard.writeText(fileBase64.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}
</script>

<template>
  <div class="file-codec">
    <div class="file-mode-toggle">
      <button
        :class="['mode-btn', { active: fileMode === 'encode' }]"
        @click="fileMode = 'encode'"
      >{{ t('base64.encodeFile') }}</button>
      <button
        :class="['mode-btn', { active: fileMode === 'decode' }]"
        @click="fileMode = 'decode'"
      >{{ t('base64.decodeFile') }}</button>
    </div>
    <div class="url-safe-row">
      <label class="url-safe-toggle">
        <input type="checkbox" v-model="urlSafe" />
        {{ t('base64.urlSafe') }}
      </label>
    </div>

    <div v-if="fileMode === 'encode'" class="encode-section">
      <div
        class="file-drop"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @click="$refs.fileInput.click()"
      >
        <input ref="fileInput" type="file" class="file-input" @change="handleFileSelect" />
        <span v-if="selectedFile">{{ fileInfo }}</span>
        <span v-else>{{ t('base64.selectFile') }} / {{ t('base64.dropFile') }}</span>
      </div>
      <div class="result-area" v-if="fileBase64">
        <div class="result-header">
          <span>{{ t('base64.fileResult') }}</span>
          <button class="btn-copy" @click="copyBase64">
            {{ copied ? t('base64.copied') : t('base64.copy') }}
          </button>
        </div>
        <textarea class="result-textarea" :value="fileBase64" readonly></textarea>
      </div>
      <div class="processing" v-if="isProcessing">{{ t('base64.encodeFile') }}...</div>
    </div>

    <div v-else class="decode-section">
      <div class="decode-fields">
        <textarea
          v-model="decodeInput"
          class="decode-textarea"
          :placeholder="t('base64.decodeInput')"
          spellcheck="false"
        ></textarea>
        <div class="filename-row">
          <label>{{ t('base64.fileName') }}:</label>
          <input v-model="decodeFileName" type="text" class="filename-input" placeholder="decoded-file" />
        </div>
        <button class="btn-decode" @click="handleDecode" :disabled="!decodeInput">
          {{ t('base64.download') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-codec {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
.file-mode-toggle {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
  width: fit-content;
}
.mode-btn {
  padding: 5px 14px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.mode-btn.active {
  background: #4a90d9;
  color: #fff;
}
.url-safe-row {
  display: flex;
}
.url-safe-toggle {
  font-size: 13px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.url-safe-toggle input {
  accent-color: #4a90d9;
}
.encode-section, .decode-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}
.file-drop {
  padding: 24px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  text-align: center;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.file-drop:hover {
  border-color: #4a90d9;
  color: #4a90d9;
}
.file-input {
  display: none;
}
.result-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
}
.btn-copy {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-copy:hover {
  background: #f0f0f0;
}
.result-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #333;
  outline: none;
  resize: none;
  background: #f9f9f9;
  word-break: break-all;
}
.processing {
  text-align: center;
  color: #888;
  font-size: 13px;
}
.decode-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.decode-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  outline: none;
  resize: none;
}
.decode-textarea:focus {
  border-color: #4a90d9;
}
.decode-textarea::placeholder {
  color: #bbb;
}
.filename-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}
.filename-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
}
.filename-input:focus {
  border-color: #4a90d9;
}
.btn-decode {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  align-self: flex-start;
}
.btn-decode:hover:not(:disabled) {
  background: #3a7bc8;
}
.btn-decode:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
