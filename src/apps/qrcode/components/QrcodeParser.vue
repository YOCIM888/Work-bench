<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useQrcodeParser } from '../composables/useQrcodeParser.js'

const { t } = useI18n()

const {
  imageSrc, parsedText, parsedType, parsedDetails, error,
  parseImage, clear
} = useQrcodeParser()

const copied = ref(false)

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) parseImage(file)
}

function handleDragOver(e) {
  e.preventDefault()
}

function handleFileInput(e) {
  const file = e.target.files?.[0]
  if (file) parseImage(file)
}

function copyText() {
  if (!parsedText.value) return
  navigator.clipboard.writeText(parsedText.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}
</script>

<template>
  <div class="qrcode-parser">
    <div class="parser-layout">
      <div class="upload-area">
        <div
          v-if="!imageSrc"
          class="drop-zone"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @click="$refs.fileInput.click()"
        >
          <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="handleFileInput" />
          <span class="drop-icon">📷</span>
          <span>{{ t('qrcode.dropImage') }}</span>
          <span class="drop-sub">{{ t('qrcode.orClick') }}</span>
        </div>
        <div v-else class="preview-area">
          <img :src="imageSrc" class="preview-img" alt="uploaded" />
          <button class="btn-clear" @click="clear">✕</button>
        </div>
      </div>

      <div class="result-area">
        <div class="error-msg" v-if="error">{{ t('qrcode.' + error) }}</div>
        <template v-else-if="parsedText">
          <div class="result-header">
            <span class="section-label">{{ t('qrcode.parsedResult') }}</span>
            <span class="type-badge">{{ t('qrcode.' + parsedType) }}</span>
          </div>

          <div v-if="parsedType === 'wifi' && parsedDetails" class="detail-card">
            <div class="detail-title">{{ t('qrcode.wifiNetwork') }}</div>
            <div class="detail-row"><span class="detail-label">SSID</span><span>{{ parsedDetails.ssid }}</span></div>
            <div class="detail-row"><span class="detail-label">{{ t('qrcode.password') }}</span><span>{{ parsedDetails.password }}</span></div>
            <div class="detail-row"><span class="detail-label">{{ t('qrcode.encryption') }}</span><span>{{ parsedDetails.encryption }}</span></div>
          </div>

          <div v-else-if="parsedType === 'vcard' && parsedDetails" class="detail-card">
            <div class="detail-title">{{ t('qrcode.contactInfo') }}</div>
            <div v-if="parsedDetails.name" class="detail-row"><span class="detail-label">{{ t('qrcode.name') }}</span><span>{{ parsedDetails.name }}</span></div>
            <div v-if="parsedDetails.phone" class="detail-row"><span class="detail-label">{{ t('qrcode.phone') }}</span><span>{{ parsedDetails.phone }}</span></div>
            <div v-if="parsedDetails.email" class="detail-row"><span class="detail-label">{{ t('qrcode.email') }}</span><span>{{ parsedDetails.email }}</span></div>
            <div v-if="parsedDetails.org" class="detail-row"><span class="detail-label">{{ t('qrcode.org') }}</span><span>{{ parsedDetails.org }}</span></div>
          </div>

          <div class="raw-text">{{ parsedText }}</div>

          <div class="result-actions">
            <button class="btn-primary" @click="copyText">{{ copied ? t('qrcode.copied') : t('qrcode.copyText') }}</button>
            <a v-if="parsedType === 'url'" :href="parsedText" target="_blank" class="btn-link">{{ t('qrcode.openUrl') }}</a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qrcode-parser {
  height: 100%;
}
.parser-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}
.upload-area {
  flex: 1;
  min-width: 0;
}
.drop-zone {
  height: 100%;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: #888;
  font-size: 14px;
  transition: border-color 0.2s;
}
.drop-zone:hover { border-color: #4a90d9; }
.file-input { display: none; }
.drop-icon { font-size: 32px; margin-bottom: 8px; }
.drop-sub { font-size: 12px; color: #aaa; }
.preview-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}
.preview-img {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
}
.btn-clear {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-clear:hover { color: #e74c3c; }
.result-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.error-msg {
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.type-badge {
  padding: 2px 8px;
  background: #e8f0fe;
  color: #4a90d9;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}
.detail-card {
  padding: 8px;
  background: #f9f9f9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-title {
  font-size: 12px;
  font-weight: 600;
  color: #4a90d9;
  margin-bottom: 2px;
}
.detail-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
}
.detail-label {
  color: #888;
  min-width: 60px;
}
.raw-text {
  padding: 8px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  color: #333;
  word-break: break-all;
  max-height: 100px;
  overflow-y: auto;
}
.result-actions {
  display: flex;
  gap: 6px;
}
.btn-primary {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
}
.btn-primary:hover { opacity: 0.85; }
.btn-link {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #4a90d9;
  border-radius: 4px;
  background: #fff;
  color: #4a90d9;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
.btn-link:hover { background: #f0f7ff; }
</style>
