<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const emit = defineEmits(['insert', 'download-md', 'download-html'])

const tools = [
  { type: 'heading1', icon: 'H1' },
  { type: 'heading2', icon: 'H2' },
  { type: 'heading3', icon: 'H3' },
  { type: 'bold', icon: 'B' },
  { type: 'italic', icon: 'I' },
  { type: 'strikethrough', icon: 'S' },
  { type: 'unorderedList', icon: '•' },
  { type: 'orderedList', icon: '1.' },
  { type: 'link', icon: '🔗' },
  { type: 'image', icon: '🖼' },
  { type: 'inlineCode', icon: '</>' },
  { type: 'codeBlock', icon: '{ }' },
  { type: 'blockquote', icon: '❝' },
  { type: 'horizontalRule', icon: '—' }
]
</script>

<template>
  <div class="editor-toolbar">
    <div class="tool-group">
      <button
        v-for="tool in tools"
        :key="tool.type"
        class="tool-btn"
        :title="t('markdownEditor.' + tool.type)"
        @click="$emit('insert', tool.type)"
      >
        {{ tool.icon }}
      </button>
    </div>
    <div class="export-group">
      <button class="export-btn" @click="$emit('download-md')">{{ t('markdownEditor.downloadMd') }}</button>
      <button class="export-btn" @click="$emit('download-html')">{{ t('markdownEditor.downloadHtml') }}</button>
    </div>
  </div>
</template>

<style scoped>
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid #e5e5e5;
  gap: 8px;
  flex-wrap: wrap;
}
.tool-group {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}
.tool-btn {
  width: 30px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-family: 'Consolas', 'Monaco', monospace;
}
.tool-btn:hover {
  background: #e8e8e8;
  border-color: #ddd;
}
.export-group {
  display: flex;
  gap: 6px;
}
.export-btn {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.export-btn:hover {
  background: #f0f0f0;
}
</style>
