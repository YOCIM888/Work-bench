<script setup>
import JsonInput from './components/JsonInput.vue'
import JsonTree from './components/JsonTree.vue'
import { useJsonViewer } from './composables/useJsonViewer.js'

const {
  jsonText, searchQuery, expandedPaths,
  parsedData, parseError,
  formatJson, minifyJson,
  toggleExpand, expandAll, collapseAll,
  copyPath, stats
} = useJsonViewer()

function handleClear() {
  jsonText.value = ''
  searchQuery.value = ''
  expandedPaths.value = new Set(['root'])
}
</script>

<template>
  <div class="json-viewer-app">
    <JsonInput
      v-model="jsonText"
      :error="parseError"
      class="viewer-pane"
      @format="formatJson"
      @minify="minifyJson"
      @clear="handleClear"
    />
    <div class="viewer-divider"></div>
    <JsonTree
      :data="parsedData"
      :expanded-paths="expandedPaths"
      :search-query="searchQuery"
      :stats="stats"
      class="viewer-pane"
      @toggle-expand="toggleExpand"
      @expand-all="expandAll"
      @collapse-all="collapseAll"
      @copy-path="copyPath"
      @update:search-query="searchQuery = $event"
    />
  </div>
</template>

<style scoped>
.json-viewer-app {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
}
.viewer-pane {
  flex: 1;
  min-width: 0;
}
.viewer-divider {
  width: 1px;
  background: #e5e5e5;
  flex-shrink: 0;
}
</style>
