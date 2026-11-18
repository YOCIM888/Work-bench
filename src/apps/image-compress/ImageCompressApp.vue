<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const originalUrl = ref('')
const originalSize = ref(0)
const originalName = ref('')
const compressedUrl = ref('')
const compressedSize = ref(0)
const quality = ref(0.7)
const format = ref('image/jpeg')
const maxWidth = ref(0)
const imgDims = ref({ w: 0, h: 0 })
const error = ref('')
const dragOver = ref(false)

const formats = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/png', label: 'PNG (无损)' }
]

function handleFile(file) {
  error.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    return
  }
  originalName.value = file.name
  originalSize.value = file.size
  compressedUrl.value = ''
  compressedSize.value = 0
  const reader = new FileReader()
  reader.onload = () => {
    originalUrl.value = reader.result
    const img = new Image()
    img.onload = () => {
      imgDims.value = { w: img.width, h: img.height }
      compress()
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

function onInput(e) {
  handleFile(e.target.files[0])
}

function onDrop(e) {
  e.preventDefault()
  dragOver.value = false
  handleFile(e.dataTransfer.files[0])
}

function compress() {
  if (!originalUrl.value) return
  const img = new Image()
  img.onload = () => {
    let w = img.width
    let h = img.height
    if (maxWidth.value && w > maxWidth.value) {
      h = Math.round(h * (maxWidth.value / w))
      w = maxWidth.value
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (format.value === 'image/jpeg') {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
    }
    ctx.drawImage(img, 0, 0, w, h)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          error.value = '压缩失败'
          return
        }
        compressedSize.value = blob.size
        const reader = new FileReader()
        reader.onload = () => {
          compressedUrl.value = reader.result
        }
        reader.readAsDataURL(blob)
      },
      format.value,
      quality.value
    )
  }
  img.src = originalUrl.value
}

function download() {
  if (!compressedUrl.value) return
  const a = document.createElement('a')
  a.href = compressedUrl.value
  a.download = 'compressed.' + format.value.split('/')[1]
  a.click()
}

function formatSize(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(2) + ' MB'
}

const saving = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})
</script>

<template>
  <ToolLayout icon="🗜️" title="图片压缩" description="使用 Canvas 在浏览器本地压缩图片，可调整质量、格式与最大宽度。">
    <div
      class="dropzone"
      :class="{ over: dragOver }"
      @drop="onDrop"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
    >
      <input type="file" accept="image/*" @change="onInput" id="compress-file" hidden />
      <label for="compress-file">📁 点击选择或拖拽图片到此处</label>
      <span v-if="error" class="err">⚠ {{ error }}</span>
    </div>

    <div v-if="originalUrl" class="work">
      <div class="opts">
        <label class="opt">质量
          <input type="range" min="0.1" max="1" step="0.05" v-model.number="quality" @input="compress" />
          {{ Math.round(quality * 100) }}%
        </label>
        <label class="opt">格式
          <select v-model="format" @change="compress">
            <option v-for="f in formats" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </label>
        <label class="opt">最大宽度 (px, 0=不缩放)
          <input type="number" min="0" v-model.number="maxWidth" @input="compress" />
        </label>
      </div>

      <div class="compare">
        <div class="side">
          <div class="side-title">原始 ({{ formatSize(originalSize) }})</div>
          <img :src="originalUrl" alt="原始" />
          <div class="dims">{{ imgDims.w }} × {{ imgDims.h }}</div>
        </div>
        <div class="side">
          <div class="side-title">
            压缩后 ({{ formatSize(compressedSize) }})
            <span v-if="saving > 0" class="save">↓ {{ saving }}%</span>
          </div>
          <img v-if="compressedUrl" :src="compressedUrl" alt="压缩后" />
          <div v-else class="ph">压缩中…</div>
        </div>
      </div>

      <button @click="download" :disabled="!compressedUrl">⬇ 下载压缩图片</button>
    </div>
  </ToolLayout>
</template>

<style scoped>
.dropzone {
  border: 2px dashed var(--border);
  border-radius: 10px;
  padding: 28px;
  text-align: center;
  margin-bottom: 16px;
}

.dropzone.over {
  border-color: var(--primary);
  background: var(--primary-tint);
}

.dropzone label {
  cursor: pointer;
  font-size: 14px;
  color: var(--text-soft);
}

.err {
  display: block;
  color: var(--danger);
  font-size: 12px;
  margin-top: 8px;
}

.opts {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.opt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
}

.opt input[type='range'] {
  width: 100px;
}

.opt input[type='number'] {
  width: 90px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
}

.opt select {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
}

.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.side {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.side-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.save {
  color: var(--success);
}

.side img {
  max-width: 100%;
  max-height: 220px;
  border-radius: 6px;
}

.dims {
  font-size: 11px;
  color: var(--text-soft);
  margin-top: 6px;
}

.ph {
  color: var(--text-soft);
  font-size: 13px;
  height: 100px;
  line-height: 100px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 13px;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .compare {
    grid-template-columns: 1fr;
  }
}
</style>
