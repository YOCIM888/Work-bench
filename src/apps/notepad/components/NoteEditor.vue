<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  note: { type: Object, default: null }
})

const emit = defineEmits(['update'])

const wordCount = computed(() => props.note ? props.note.content.length : 0)

function onInput(field, event) {
  emit('update', { [field]: event.target.value })
}

function downloadNote() {
  if (!props.note) return
  const title = props.note.title || 'untitled'
  const content = props.note.content || ''
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = title + '.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="note-editor" v-if="note">
    <div class="editor-header">
      <input
        class="title-input"
        :value="note.title"
        @input="onInput('title', $event)"
        :placeholder="t('notepad.titlePlaceholder')"
      />
    </div>
    <textarea
      class="content-input"
      :value="note.content"
      @input="onInput('content', $event)"
      :placeholder="t('notepad.contentPlaceholder')"
    ></textarea>
    <div class="editor-footer">
      <button class="btn-download" @click="downloadNote">{{ t('notepad.download') }}</button>
      <span class="word-count">{{ t('notepad.wordCount', { count: wordCount }) }}</span>
    </div>
  </div>
  <div class="note-editor-empty" v-else>
    <p>{{ t('notepad.emptyState') }}</p>
  </div>
</template>

<style scoped>
.note-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.editor-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
}
.title-input {
  width: 100%;
  border: none;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  outline: none;
  padding: 4px 0;
}
.title-input::placeholder {
  color: #ccc;
}
.content-input {
  flex: 1;
  width: 100%;
  border: none;
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  color: #444;
  outline: none;
  resize: none;
  font-family: inherit;
}
.content-input::placeholder {
  color: #ccc;
}
.editor-footer {
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}
.btn-download {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #555;
  transition: background 0.15s;
}
.btn-download:hover {
  background: #f0f0f0;
}
.word-count {
  font-size: 12px;
  color: #aaa;
}
.note-editor-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 14px;
}
</style>
