<script setup>
import { ref } from 'vue'
import EditorToolbar from './components/EditorToolbar.vue'
import MarkdownInput from './components/MarkdownInput.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import { useMarkdown } from './composables/useMarkdown.js'

const {
  content, html, wordCount,
  insertMarkdown, downloadMd, downloadHtml
} = useMarkdown()

const inputRef = ref(null)

function handleInsert(type) {
  const textarea = inputRef.value?.textareaRef
  if (textarea) {
    insertMarkdown(type, textarea)
  }
}

function syncScroll(e) {
  const preview = e.target.closest('.editor-body')?.querySelector('.markdown-preview .preview-content')
  if (!preview) return
  const ratio = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight || 1)
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight)
}
</script>

<template>
  <div class="markdown-editor-app">
    <EditorToolbar
      @insert="handleInsert"
      @download-md="downloadMd"
      @download-html="downloadHtml"
    />
    <div class="editor-body">
      <MarkdownInput
        ref="inputRef"
        v-model="content"
        :word-count="wordCount"
        class="editor-pane"
        @scroll="syncScroll"
      />
      <div class="editor-divider"></div>
      <MarkdownPreview
        :html="html"
        class="editor-pane"
      />
    </div>
  </div>
</template>

<style scoped>
.markdown-editor-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.editor-body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.editor-pane {
  flex: 1;
  min-width: 0;
}
.editor-divider {
  width: 1px;
  background: #e5e5e5;
  flex-shrink: 0;
}
</style>
