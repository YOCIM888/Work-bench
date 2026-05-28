<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from '@/i18n/index.js'
import ImageUploader from './components/ImageUploader.vue'
import ImageInfo from './components/ImageInfo.vue'
import Base64Output from './components/Base64Output.vue'
import { useImageBase64 } from './composables/useImageBase64.js'

const { t } = useI18n()

const {
  imageFile, imageSrc, imageInfo,
  outputWidth, outputHeight, keepRatio,
  quality, outputFormat,
  base64Result, dataUrl, cssBackground, htmlImg,
  isProcessing,
  handleFile, handlePaste, processImage,
  updateWidth, updateHeight, clear
} = useImageBase64()

function onFileSelect(file) {
  handleFile(file)
}

function onPaste(e) {
  handlePaste(e)
}

onMounted(() => {
  window.addEventListener('paste', onPaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', onPaste)
})

watch(outputFormat, () => {
  if (imageSrc.value) processImage()
})

watch(quality, () => {
  if (imageSrc.value && outputFormat.value !== 'png') processImage()
})
</script>

<template>
  <div class="image-base64-app">
    <ImageUploader :image-src="imageSrc" @file-select="onFileSelect" />

    <ImageInfo
      v-if="imageInfo"
      :image-info="imageInfo"
      :output-width="outputWidth"
      :output-height="outputHeight"
      :keep-ratio="keepRatio"
      :quality="quality"
      :output-format="outputFormat"
      @update:output-width="updateWidth"
      @update:output-height="updateHeight"
      @update:keep-ratio="keepRatio = $event"
      @update:quality="quality = $event"
      @update:output-format="outputFormat = $event"
    />

    <div class="processing" v-if="isProcessing">{{ t('imageBase64.processing') }}</div>

    <Base64Output
      :base64="base64Result"
      :data-url="dataUrl"
      :css-background="cssBackground"
      :html-img="htmlImg"
    />

    <button class="btn-clear" v-if="imageSrc" @click="clear">✕</button>
  </div>
</template>

<style scoped>
.image-base64-app {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  width: 100%;
  padding: 16px;
  overflow-y: auto;
  position: relative;
}
.processing {
  text-align: center;
  color: #888;
  font-size: 13px;
  padding: 8px;
}
.btn-clear {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-clear:hover {
  background: #f0f0f0;
  color: #e74c3c;
}
</style>
