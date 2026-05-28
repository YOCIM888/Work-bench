<script setup>
import { onMounted } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useQrcodeGenerator } from '../composables/useQrcodeGenerator.js'

const { t } = useI18n()

const {
  contentType, textContent, urlContent,
  vcardFields, wifiFields,
  size, fgColor, bgColor, errorLevel,
  canvasRef, copied, inputText,
  generate, download, copyToClipboard
} = useQrcodeGenerator()

const contentTypes = ['text', 'url', 'vcard', 'wifi']
const sizes = [128, 256, 512]
const levels = ['L', 'M', 'Q', 'H']
const encryptions = ['WPA', 'WEP', 'nopass']

onMounted(() => {
  generate()
})
</script>

<template>
  <div class="qrcode-generator">
    <div class="gen-layout">
      <div class="gen-left">
        <div class="type-tabs">
          <button
            v-for="ct in contentTypes"
            :key="ct"
            :class="['type-btn', { active: contentType === ct }]"
            @click="contentType = ct"
          >{{ t('qrcode.' + ct) }}</button>
        </div>

        <div class="input-area">
          <textarea v-if="contentType === 'text'" v-model="textContent" class="gen-textarea" :placeholder="t('qrcode.textPlaceholder')"></textarea>
          <input v-else-if="contentType === 'url'" v-model="urlContent" type="text" class="gen-input" :placeholder="t('qrcode.urlPlaceholder')" />
          <div v-else-if="contentType === 'vcard'" class="field-list">
            <input v-model="vcardFields.name" class="gen-input" :placeholder="t('qrcode.name')" />
            <input v-model="vcardFields.phone" class="gen-input" :placeholder="t('qrcode.phone')" />
            <input v-model="vcardFields.email" class="gen-input" :placeholder="t('qrcode.email')" />
            <input v-model="vcardFields.org" class="gen-input" :placeholder="t('qrcode.org')" />
            <input v-model="vcardFields.address" class="gen-input" :placeholder="t('qrcode.address')" />
          </div>
          <div v-else-if="contentType === 'wifi'" class="field-list">
            <input v-model="wifiFields.ssid" class="gen-input" :placeholder="t('qrcode.ssid')" />
            <input v-model="wifiFields.password" class="gen-input" :placeholder="t('qrcode.password')" />
            <select v-model="wifiFields.encryption" class="gen-select">
              <option v-for="enc in encryptions" :key="enc" :value="enc">{{ t('qrcode.' + enc.toLowerCase()) }}</option>
            </select>
          </div>
        </div>

        <div class="style-options">
          <div class="option-row">
            <span class="option-label">{{ t('qrcode.size') }}</span>
            <div class="size-btns">
              <button v-for="s in sizes" :key="s" :class="['size-btn', { active: size === s }]" @click="size = s">{{ s }}</button>
            </div>
          </div>
          <div class="option-row">
            <span class="option-label">{{ t('qrcode.errorLevel') }}</span>
            <div class="level-btns">
              <button v-for="l in levels" :key="l" :class="['level-btn', { active: errorLevel === l }]" @click="errorLevel = l">{{ l }}</button>
            </div>
          </div>
          <div class="option-row">
            <span class="option-label">{{ t('qrcode.fgColor') }}</span>
            <input type="color" v-model="fgColor" class="color-input" />
          </div>
          <div class="option-row">
            <span class="option-label">{{ t('qrcode.bgColor') }}</span>
            <input type="color" v-model="bgColor" class="color-input" />
          </div>
        </div>
      </div>

      <div class="gen-right">
        <div class="canvas-wrapper">
          <canvas ref="canvasRef" class="qr-canvas"></canvas>
        </div>
        <div class="gen-actions">
          <button class="btn-primary" @click="download" :disabled="!inputText.trim()">{{ t('qrcode.download') }}</button>
          <button class="btn-secondary" @click="copyToClipboard" :disabled="!inputText.trim()">
            {{ copied ? t('qrcode.copied') : t('qrcode.copyImg') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qrcode-generator {
  height: 100%;
}
.gen-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}
.gen-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.gen-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}
.type-tabs {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}
.type-btn {
  flex: 1;
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  color: #555;
  cursor: pointer;
}
.type-btn.active {
  background: #4a90d9;
  color: #fff;
}
.input-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.gen-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  color: #333;
  outline: none;
  resize: none;
}
.gen-textarea:focus { border-color: #4a90d9; }
.gen-textarea::placeholder { color: #bbb; }
.gen-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
}
.gen-input:focus { border-color: #4a90d9; }
.gen-input::placeholder { color: #bbb; }
.gen-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  background: #fff;
}
.field-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.style-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 6px;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.option-label {
  font-size: 12px;
  color: #888;
  min-width: 70px;
}
.size-btns, .level-btns {
  display: flex;
  gap: 2px;
}
.size-btn, .level-btn {
  padding: 2px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.size-btn.active, .level-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.color-input {
  width: 32px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1px;
  cursor: pointer;
}
.canvas-wrapper {
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}
.qr-canvas {
  display: block;
  max-width: 100%;
}
.gen-actions {
  display: flex;
  gap: 6px;
  width: 100%;
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
}
.btn-primary:disabled { background: #ccc; cursor: not-allowed; }
.btn-primary:hover:not(:disabled) { opacity: 0.85; }
.btn-secondary {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 12px;
  cursor: pointer;
}
.btn-secondary:disabled { color: #ccc; cursor: not-allowed; }
.btn-secondary:hover:not(:disabled) { background: #f0f0f0; }
</style>
