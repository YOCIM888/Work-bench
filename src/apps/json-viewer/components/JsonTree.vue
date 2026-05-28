<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import JsonTreeNode from './JsonTreeNode.vue'

const { t } = useI18n()

const props = defineProps({
  data: { default: null },
  expandedPaths: { type: Set, default: () => new Set() },
  searchQuery: { type: String, default: '' },
  stats: { type: Object, default: () => ({ objects: 0, arrays: 0, values: 0 }) }
})

const emit = defineEmits(['toggle-expand', 'expand-all', 'collapse-all', 'copy-path', 'update:searchQuery'])

const pathCopied = ref(false)

function handleCopyPath(path) {
  emit('copy-path', path)
  pathCopied.value = true
  setTimeout(() => { pathCopied.value = false }, 1500)
}
</script>

<template>
  <div class="json-tree">
    <div class="tree-toolbar">
      <input
        class="search-input"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        :placeholder="t('jsonViewer.search')"
      />
      <button class="btn-tree" @click="$emit('expand-all')">{{ t('jsonViewer.expandAll') }}</button>
      <button class="btn-tree" @click="$emit('collapse-all')">{{ t('jsonViewer.collapseAll') }}</button>
    </div>
    <div class="tree-stats" v-if="data">
      <span>{{ t('jsonViewer.objects', { count: stats.objects }) }}</span>
      <span>{{ t('jsonViewer.arrays', { count: stats.arrays }) }}</span>
      <span>{{ t('jsonViewer.values', { count: stats.values }) }}</span>
    </div>
    <div class="tree-content" v-if="data">
      <JsonTreeNode
        key-name="root"
        :value="data"
        path="root"
        :expanded-paths="expandedPaths"
        :is-last="true"
        :search-query="searchQuery"
        :depth="0"
        @toggle-expand="$emit('toggle-expand', $event)"
        @copy-path="handleCopyPath"
      />
    </div>
    <div class="no-data" v-else>
      {{ t('jsonViewer.noData') }}
    </div>
    <div class="path-copied-toast" v-if="pathCopied">{{ t('jsonViewer.pathCopied') }}</div>
  </div>
</template>

<style scoped>
.json-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tree-toolbar {
  display: flex;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e5e5;
  align-items: center;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 100px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}
.search-input:focus {
  border-color: #4a90d9;
}
.btn-tree {
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
.btn-tree:hover {
  background: #f0f0f0;
}
.tree-stats {
  display: flex;
  gap: 12px;
  padding: 4px 10px;
  font-size: 11px;
  color: #888;
  border-bottom: 1px solid #eee;
}
.tree-content {
  flex: 1;
  overflow: auto;
  padding: 8px;
}
.no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 14px;
}
.path-copied-toast {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #333;
  color: #fff;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  animation: fadeInOut 1.5s ease;
}
@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
