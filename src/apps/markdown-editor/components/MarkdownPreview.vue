<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  html: { type: String, default: '' }
})
</script>

<template>
  <div class="markdown-preview">
    <div class="preview-label">{{ t('markdownEditor.preview') }}</div>
    <div class="preview-content markdown-body" v-if="html" v-html="html"></div>
    <div class="preview-empty" v-else>
      {{ t('markdownEditor.placeholder') }}
    </div>
  </div>
</template>

<style scoped>
.markdown-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.preview-label {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}
.preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  color: #24292e;
}
.preview-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 14px;
}
</style>

<style>
.markdown-body h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
.markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
.markdown-body h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
.markdown-body h4 { font-size: 1em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
.markdown-body p { margin-top: 0; margin-bottom: 16px; }
.markdown-body ul, .markdown-body ol { padding-left: 2em; margin-top: 0; margin-bottom: 16px; }
.markdown-body li { margin-bottom: 4px; }
.markdown-body code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background: rgba(27,31,35,0.05); border-radius: 3px; font-family: 'Consolas', 'Monaco', monospace; }
.markdown-body pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background: #f6f8fa; border-radius: 6px; margin-bottom: 16px; }
.markdown-body pre code { padding: 0; background: transparent; font-size: 100%; }
.markdown-body blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; }
.markdown-body blockquote p { margin: 0; }
.markdown-body img { max-width: 100%; border-radius: 4px; }
.markdown-body a { color: #0366d6; text-decoration: none; }
.markdown-body a:hover { text-decoration: underline; }
.markdown-body hr { border: 0; height: 1px; background: #e1e4e8; margin: 24px 0; }
.markdown-body table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
.markdown-body th, .markdown-body td { padding: 6px 13px; border: 1px solid #dfe2e5; }
.markdown-body th { font-weight: 600; background: #f6f8fa; }
.markdown-body tr:nth-child(even) { background: #f6f8fa; }
.markdown-body .hljs { background: #f6f8fa; }
</style>
