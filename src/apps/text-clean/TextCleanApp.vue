<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const input = ref('  第一行  \n\n第二行\n第一行\n  第三行\n\n')
const output = ref('')

const actions = [
  { id: 'trim', name: '去除行首尾空格', fn: (t) => t.split('\n').map((l) => l.trim()).join('\n') },
  { id: 'blank', name: '去除空行', fn: (t) => t.split('\n').filter((l) => l.trim() !== '').join('\n') },
  { id: 'allspace', name: '去除所有空白', fn: (t) => t.replace(/\s+/g, '') },
  { id: 'dedupe', name: '去除重复行(保留顺序)', fn: (t) => [...new Set(t.split('\n'))].join('\n') },
  { id: 'sortAsc', name: '行排序 A→Z', fn: (t) => t.split('\n').sort((a, b) => a.localeCompare(b)).join('\n') },
  { id: 'sortDesc', name: '行排序 Z→A', fn: (t) => t.split('\n').sort((a, b) => b.localeCompare(a)).join('\n') },
  { id: 'reverse', name: '反转行序', fn: (t) => t.split('\n').reverse().join('\n') },
  { id: 'upper', name: '全部大写', fn: (t) => t.toUpperCase() },
  { id: 'lower', name: '全部小写', fn: (t) => t.toLowerCase() },
  { id: 'tab2space', name: 'Tab 转 2 空格', fn: (t) => t.replace(/\t/g, '  ') },
  { id: 'space2tab', name: '2 空格转 Tab', fn: (t) => t.replace(/ {2}/g, '\t') }
]

function apply(action) {
  output.value = action.fn(input.value)
}

function useAsInput() {
  input.value = output.value
  output.value = ''
}

const stats = computed(() => ({
  lines: input.value ? input.value.split('\n').length : 0,
  chars: input.value.length
}))
</script>

<template>
  <ToolLayout icon="🧹" title="文本清理" description="一键去除空行、去重、排序、转换空白等批量文本处理。">
    <div class="pane">
      <div class="pane-title">输入 ({{ stats.lines }} 行 / {{ stats.chars }} 字符)</div>
      <textarea v-model="input" rows="8" spellcheck="false"></textarea>
    </div>

    <div class="btns">
      <button v-for="a in actions" :key="a.id" @click="apply(a)">{{ a.name }}</button>
    </div>

    <div class="pane">
      <div class="pane-title">
        结果
        <button class="mini" @click="copy(output)" :disabled="!output">复制</button>
        <button class="mini" @click="useAsInput" :disabled="!output">用作输入</button>
      </div>
      <textarea :value="output" rows="8" readonly spellcheck="false"></textarea>
    </div>
  </ToolLayout>
</template>

<style scoped>
.pane {
  margin-bottom: 16px;
}

.pane-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini {
  margin-left: 8px;
  padding: 3px 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-soft);
  border-radius: 6px;
  font-size: 12px;
}

.mini:first-of-type {
  margin-left: auto;
}

.mini:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.btns button {
  padding: 6px 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  border-radius: 8px;
  font-size: 12px;
}

.btns button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

textarea:focus {
  border-color: var(--primary);
}
</style>
