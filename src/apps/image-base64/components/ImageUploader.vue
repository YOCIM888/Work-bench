<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  imageSrc: { type: String, default: '' }
})

const emit = defineEmits(['file-select', 'paste'])

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('file-select', file)
  }
}

function handleDragOver(e) {
  e.preventDefault()
}

function handleFileInput(e) {
  const file = e.target.files?.[0]
  if (file) emit('file-select', file)
}
</script>

<template>
  <div class="image-uploader">
    <div
      v-if="!imageSrc"
      class="drop-zone"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @click="$refs.fileInput.click()"
    >
      <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="handleFileInput" />
      <div class="drop-text">
        <span class="drop-icon">🖼️</span>
        <span>{{ t('imageBase64.dropImage') }}</span>
        <span class="drop-sub">{{ t('imageBase64.orClick') }}</span>
        <span class="drop-sub">{{ t('imageBase64.orPaste') }}</span>
      </div>
    </div>
    <div v-else class="preview-zone">
      <img :src="imageSrc" class="preview-img" alt="preview" />
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
}
.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 32px 16px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.drop-zone:hover {
  border-color: #4a90d9;
}
.file-input {
  display: none;
}
.drop-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  color: #888;
  font-size: 14px;
}
.drop-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.drop-sub {
  font-size: 12px;
  color: #aaa;
}
.preview-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
  max-height: 200px;
  overflow: hidden;
}
.preview-img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
}
</style>
