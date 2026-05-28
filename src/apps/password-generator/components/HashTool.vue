<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useHash } from '../composables/useHash.js'

const { t } = useI18n()

const {
  inputText, selectedAlgorithm, hmacKey, hmacMode,
  hashResult, fileHashResult, isComputing, selectedFile,
  algorithms,
  computeTextHash, handleFileSelect
} = useHash()

const copied = ref(false)
const copiedFile = ref(false)

function copyHash(text, type) {
  navigator.clipboard.writeText(text).then(() => {
    if (type === 'text') {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1500)
    } else {
      copiedFile.value = true
      setTimeout(() => { copiedFile.value = false }, 1500)
    }
  })
}

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files?.[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleFileSelect(fakeEvent)
  }
}

function handleDragOver(e) {
  e.preventDefault()
}
</script>

<template>
  <div class="hash-tool">
    <div class="hash-section">
      <label class="section-label">{{ t('passwordGenerator.inputText') }}</label>
      <textarea
        v-model="inputText"
        class="hash-input"
        :placeholder="t('passwordGenerator.textPlaceholder')"
        spellcheck="false"
        rows="3"
      ></textarea>
      <div class="hash-controls">
        <div class="control-row">
          <label class="control-label">{{ t('passwordGenerator.algorithm') }}</label>
          <select v-model="selectedAlgorithm" class="algo-select">
            <option v-for="algo in algorithms" :key="algo.id" :value="algo.id">{{ algo.name }}</option>
          </select>
        </div>
        <div class="control-row">
          <label class="checkbox-label">
            <input type="checkbox" v-model="hmacMode" /> {{ t('passwordGenerator.hmacMode') }}
          </label>
        </div>
        <div class="control-row" v-if="hmacMode">
          <label class="control-label">{{ t('passwordGenerator.hmacKey') }}</label>
          <input v-model="hmacKey" type="text" class="hmac-input" />
        </div>
        <button class="btn-compute" @click="computeTextHash" :disabled="!inputText || isComputing">
          {{ isComputing ? t('passwordGenerator.computing') : t('passwordGenerator.computeHash') }}
        </button>
      </div>
      <div class="hash-result" v-if="hashResult">
        <label class="section-label">{{ t('passwordGenerator.hashResult') }}</label>
        <div class="result-row">
          <code class="hash-value">{{ hashResult }}</code>
          <button class="btn-copy" @click="copyHash(hashResult, 'text')">
            {{ copied ? t('passwordGenerator.copied') : t('passwordGenerator.copy') }}
          </button>
        </div>
      </div>
    </div>

    <div class="file-section">
      <label class="section-label">{{ t('passwordGenerator.fileHash') }}</label>
      <div
        class="file-drop"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @click="$refs.fileInput.click()"
      >
        <input ref="fileInput" type="file" class="file-input" @change="handleFileSelect" />
        <span v-if="selectedFile">{{ selectedFile.name }}</span>
        <span v-else>{{ t('passwordGenerator.selectFile') }} / {{ t('passwordGenerator.dropFile') }}</span>
      </div>
      <div class="hash-result" v-if="fileHashResult">
        <div class="result-row">
          <code class="hash-value">{{ fileHashResult }}</code>
          <button class="btn-copy" @click="copyHash(fileHashResult, 'file')">
            {{ copiedFile ? t('passwordGenerator.copied') : t('passwordGenerator.copy') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hash-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hash-section, .file-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
}
.hash-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  outline: none;
  resize: vertical;
}
.hash-input:focus {
  border-color: #4a90d9;
}
.hash-input::placeholder {
  color: #bbb;
}
.hash-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.control-label {
  font-size: 13px;
  color: #555;
  min-width: 80px;
}
.checkbox-label {
  font-size: 13px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.checkbox-label input {
  accent-color: #4a90d9;
}
.algo-select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  background: #fff;
}
.algo-select:focus {
  border-color: #4a90d9;
}
.hmac-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
}
.hmac-input:focus {
  border-color: #4a90d9;
}
.btn-compute {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-start;
}
.btn-compute:hover:not(:disabled) {
  background: #3a7bc8;
}
.btn-compute:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.hash-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.result-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f9f9f9;
  border-radius: 6px;
}
.hash-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #333;
  word-break: break-all;
  min-width: 0;
}
.btn-copy {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-copy:hover {
  background: #f0f0f0;
}
.file-drop {
  padding: 20px;
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
</style>
