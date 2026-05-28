<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  sideBySideLines: { type: Object, default: () => ({ left: [], right: [] }) },
  unifiedLines: { type: Array, default: () => [] },
  viewMode: { type: String, default: 'side-by-side' },
  hasDiff: { type: Boolean, default: false }
})

const emit = defineEmits(['update:viewMode'])
</script>

<template>
  <div class="diff-result">
    <div class="result-toolbar">
      <button
        :class="['mode-btn', { active: viewMode === 'side-by-side' }]"
        @click="$emit('update:viewMode', 'side-by-side')"
      >
        {{ t('diffChecker.sideBySide') }}
      </button>
      <button
        :class="['mode-btn', { active: viewMode === 'unified' }]"
        @click="$emit('update:viewMode', 'unified')"
      >
        {{ t('diffChecker.unified') }}
      </button>
    </div>

    <div class="no-diff" v-if="!hasDiff">
      {{ t('diffChecker.noDiff') }}
    </div>

    <div class="side-by-side" v-else-if="viewMode === 'side-by-side'">
      <div class="diff-column">
        <div
          v-for="(line, i) in sideBySideLines.left"
          :key="'l' + i"
          :class="['diff-line', line.type]"
        >
          <span class="line-num">{{ line.lineNum || '' }}</span>
          <span class="line-text">{{ line.text }}</span>
        </div>
      </div>
      <div class="diff-column">
        <div
          v-for="(line, i) in sideBySideLines.right"
          :key="'r' + i"
          :class="['diff-line', line.type]"
        >
          <span class="line-num">{{ line.lineNum || '' }}</span>
          <span class="line-text">{{ line.text }}</span>
        </div>
      </div>
    </div>

    <div class="unified-view" v-else>
      <div
        v-for="(line, i) in unifiedLines"
        :key="i"
        :class="['diff-line', line.type]"
      >
        <span class="line-num">{{ line.lineNum || '' }}</span>
        <span class="line-prefix">{{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}</span>
        <span class="line-text">{{ line.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-result {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.result-toolbar {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e5e5;
}
.mode-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.mode-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.mode-btn:hover:not(.active) {
  background: #f0f0f0;
}
.no-diff {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 14px;
}
.side-by-side {
  flex: 1;
  display: flex;
  overflow: auto;
}
.diff-column {
  flex: 1;
  min-width: 0;
  overflow: auto;
  border-right: 1px solid #eee;
}
.diff-column:last-child {
  border-right: none;
}
.unified-view {
  flex: 1;
  overflow: auto;
}
.diff-line {
  display: flex;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  min-height: 20px;
}
.diff-line.unchanged {
  background: transparent;
}
.diff-line.added {
  background: #e6ffec;
}
.diff-line.removed {
  background: #ffebe9;
}
.diff-line.empty {
  background: #f8f8f8;
}
.line-num {
  width: 40px;
  text-align: right;
  padding-right: 8px;
  color: #bbb;
  flex-shrink: 0;
  user-select: none;
  font-size: 12px;
  border-right: 1px solid #eee;
  margin-right: 8px;
}
.line-prefix {
  width: 16px;
  text-align: center;
  flex-shrink: 0;
  font-weight: 600;
}
.diff-line.added .line-prefix {
  color: #22863a;
}
.diff-line.removed .line-prefix {
  color: #cb2431;
}
.line-text {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
  min-width: 0;
}
</style>
