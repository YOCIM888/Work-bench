<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  imageInfo: { type: Object, default: null },
  outputWidth: { type: Number, default: 0 },
  outputHeight: { type: Number, default: 0 },
  keepRatio: { type: Boolean, default: true },
  quality: { type: Number, default: 92 },
  outputFormat: { type: String, default: 'png' }
})

const emit = defineEmits([
  'update:outputWidth', 'update:outputHeight',
  'update:keepRatio', 'update:quality', 'update:outputFormat'
])
</script>

<template>
  <div class="image-info" v-if="imageInfo">
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">{{ t('imageBase64.fileName') }}</span>
        <span class="info-value">{{ imageInfo.fileName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('imageBase64.format') }}</span>
        <span class="info-value">{{ imageInfo.format }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('imageBase64.originalSize') }}</span>
        <span class="info-value">{{ imageInfo.originalWidth }} × {{ imageInfo.originalHeight }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ t('imageBase64.fileSize') }}</span>
        <span class="info-value">{{ imageInfo.fileSize }}</span>
      </div>
    </div>
    <div class="settings-grid">
      <div class="setting-row">
        <span class="setting-label">{{ t('imageBase64.outputSize') }}</span>
        <div class="size-inputs">
          <input
            type="number"
            :value="outputWidth"
            @input="$emit('update:outputWidth', $event.target.value)"
            class="size-input"
            :placeholder="t('imageBase64.width')"
          />
          <span class="size-x">×</span>
          <input
            type="number"
            :value="outputHeight"
            @input="$emit('update:outputHeight', $event.target.value)"
            class="size-input"
            :placeholder="t('imageBase64.height')"
          />
        </div>
      </div>
      <div class="setting-row">
        <label class="checkbox-label">
          <input type="checkbox" :checked="keepRatio" @change="$emit('update:keepRatio', $event.target.checked)" />
          {{ t('imageBase64.keepRatio') }}
        </label>
      </div>
      <div class="setting-row">
        <span class="setting-label">{{ t('imageBase64.outputFormat') }}</span>
        <div class="format-btns">
          <button :class="['fmt-btn', { active: outputFormat === 'png' }]" @click="$emit('update:outputFormat', 'png')">{{ t('imageBase64.png') }}</button>
          <button :class="['fmt-btn', { active: outputFormat === 'jpeg' }]" @click="$emit('update:outputFormat', 'jpeg')">{{ t('imageBase64.jpeg') }}</button>
          <button :class="['fmt-btn', { active: outputFormat === 'webp' }]" @click="$emit('update:outputFormat', 'webp')">{{ t('imageBase64.webp') }}</button>
        </div>
      </div>
      <div class="setting-row" v-if="outputFormat !== 'png'">
        <span class="setting-label">{{ t('imageBase64.quality') }}: {{ quality }}%</span>
        <input
          type="range"
          :value="quality"
          @input="$emit('update:quality', parseInt($event.target.value))"
          min="1"
          max="100"
          class="quality-slider"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.info-item {
  display: flex;
  gap: 6px;
  font-size: 12px;
}
.info-label {
  color: #888;
  min-width: 70px;
}
.info-value {
  color: #333;
  word-break: break-all;
}
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}
.setting-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.setting-label {
  font-size: 12px;
  color: #555;
  min-width: 80px;
}
.size-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}
.size-input {
  width: 70px;
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  outline: none;
}
.size-input:focus {
  border-color: #4a90d9;
}
.size-x {
  color: #aaa;
  font-size: 12px;
}
.checkbox-label {
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.checkbox-label input {
  accent-color: #4a90d9;
}
.format-btns {
  display: flex;
  gap: 2px;
}
.fmt-btn {
  padding: 3px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.fmt-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.quality-slider {
  flex: 1;
  accent-color: #4a90d9;
}
</style>
