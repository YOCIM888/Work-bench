<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  keyName: { type: [String, Number], default: '' },
  value: { default: null },
  path: { type: String, default: 'root' },
  expandedPaths: { type: Set, default: () => new Set() },
  isLast: { type: Boolean, default: true },
  searchQuery: { type: String, default: '' },
  depth: { type: Number, default: 0 }
})

const emit = defineEmits(['toggle-expand', 'copy-path'])

const copied = ref(false)

const isExpanded = ref(false)

function getNodeType(val) {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val
}

function isExpandable(val) {
  return val !== null && typeof val === 'object'
}

function getChildCount(val) {
  if (Array.isArray(val)) return val.length
  if (val && typeof val === 'object') return Object.keys(val).length
  return 0
}

function handleToggle() {
  emit('toggle-expand', props.path)
}

function handleCopyPath() {
  emit('copy-path', props.path)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}

function isHighlighted() {
  if (!props.searchQuery) return false
  const q = props.searchQuery.toLowerCase()
  return String(props.keyName).toLowerCase().includes(q) || String(props.value).toLowerCase().includes(q)
}
</script>

<template>
  <div class="tree-node" :class="{ highlighted: isHighlighted() }">
    <div class="node-row" :style="{ paddingLeft: depth * 16 + 'px' }">
      <span class="toggle-btn" v-if="isExpandable(value)" @click="handleToggle">
        <span v-if="expandedPaths.has(path)">▼</span>
        <span v-else>▶</span>
      </span>
      <span class="toggle-placeholder" v-else></span>
      <span class="key-name" v-if="keyName !== ''">{{ keyName }}: </span>
      <template v-if="isExpandable(value)">
        <span class="type-badge" @click="handleToggle">
          {{ getNodeType(value) === 'array' ? '[' : '{' }}
        </span>
        <span class="child-count" v-if="!expandedPaths.has(path)">
          {{ t('jsonViewer.items', { count: getChildCount(value) }) }}
        </span>
        <span class="type-badge" v-if="!expandedPaths.has(path)">
          {{ getNodeType(value) === 'array' ? ']' : '}' }}
        </span>
      </template>
      <template v-else>
        <span
          class="node-value"
          :class="getNodeType(value)"
          @click="handleCopyPath"
          :title="t('jsonViewer.pathCopied')"
        >
          <template v-if="getNodeType(value) === 'string'">"{{ value }}"</template>
          <template v-else-if="getNodeType(value) === 'null'">null</template>
          <template v-else>{{ value }}</template>
        </span>
      </template>
      <span class="comma" v-if="!isLast">,</span>
    </div>
    <div class="node-children" v-if="isExpandable(value) && expandedPaths.has(path)">
      <template v-if="Array.isArray(value)">
        <JsonTreeNode
          v-for="(item, index) in value"
          :key="index"
          :key-name="index"
          :value="item"
          :path="path + '[' + index + ']'"
          :expanded-paths="expandedPaths"
          :is-last="index === value.length - 1"
          :search-query="searchQuery"
          :depth="depth + 1"
          @toggle-expand="$emit('toggle-expand', $event)"
          @copy-path="$emit('copy-path', $event)"
        />
      </template>
      <template v-else>
        <JsonTreeNode
          v-for="(val, key, i) in value"
          :key="key"
          :key-name="key"
          :value="val"
          :path="path + '.' + key"
          :expanded-paths="expandedPaths"
          :is-last="i === Object.keys(value).length - 1"
          :search-query="searchQuery"
          :depth="depth + 1"
          @toggle-expand="$emit('toggle-expand', $event)"
          @copy-path="$emit('copy-path', $event)"
        />
      </template>
      <div class="closing-bracket" :style="{ paddingLeft: depth * 16 + 'px' }">
        {{ Array.isArray(value) ? ']' : '}' }}<span class="comma" v-if="!isLast">,</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}
.tree-node.highlighted > .node-row {
  background: #fff3cd;
  border-radius: 2px;
}
.node-row {
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding-right: 8px;
}
.node-row:hover {
  background: #f5f5f5;
  border-radius: 2px;
}
.toggle-btn {
  width: 16px;
  cursor: pointer;
  font-size: 9px;
  color: #999;
  flex-shrink: 0;
  text-align: center;
  user-select: none;
}
.toggle-placeholder {
  width: 16px;
  flex-shrink: 0;
}
.key-name {
  color: #6f42c1;
  font-weight: 500;
}
.type-badge {
  color: #333;
  cursor: pointer;
}
.child-count {
  color: #999;
  font-size: 12px;
  margin: 0 4px;
  font-style: italic;
}
.node-value {
  cursor: pointer;
  border-radius: 2px;
  padding: 0 2px;
}
.node-value:hover {
  background: #e8e8e8;
}
.node-value.string {
  color: #22863a;
}
.node-value.number {
  color: #005cc5;
}
.node-value.boolean {
  color: #e36209;
}
.node-value.null {
  color: #999;
}
.comma {
  color: #999;
}
.closing-bracket {
  color: #333;
}
</style>
