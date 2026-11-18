<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const input = ref('Hello World, tools.yocim.top')
const output = ref('')
const active = ref('')

const transforms = [
  { id: 'upper', name: '大写', fn: (s) => s.toUpperCase() },
  { id: 'lower', name: '小写', fn: (s) => s.toLowerCase() },
  {
    id: 'title',
    name: '标题',
    fn: (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  },
  {
    id: 'sentence',
    name: '句首',
    fn: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?。！？]\s*\w)/g, (c) => c.toUpperCase())
  },
  {
    id: 'camel',
    name: '驼峰',
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^./, (c) => c.toLowerCase())
  },
  {
    id: 'pascal',
    name: '帕斯卡',
    fn: (s) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, c) => c.toUpperCase())
  },
  {
    id: 'snake',
    name: '下划线',
    fn: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
  },
  {
    id: 'kebab',
    name: '短横线',
    fn: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
  },
  {
    id: 'constant',
    name: '常量',
    fn: (s) =>
      s
        .trim()
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
  }
]

function apply(t) {
  output.value = t.fn(input.value)
  active.value = t.id
}

apply(transforms[0])
</script>

<template>
  <ToolLayout icon="🔠" title="大小写转换" description="大写、小写、标题、驼峰、下划线、短横线等格式互转。">
    <div class="pane">
      <div class="pane-title">输入</div>
      <textarea v-model="input" rows="4" spellcheck="false"></textarea>
    </div>

    <div class="btns">
      <button
        v-for="t in transforms"
        :key="t.id"
        :class="{ active: active === t.id }"
        @click="apply(t)"
      >
        {{ t.name }}
      </button>
    </div>

    <div class="pane">
      <div class="pane-title">
        结果
        <button class="mini" @click="copy(output)" :disabled="!output">复制</button>
      </div>
      <textarea :value="output" rows="4" readonly spellcheck="false"></textarea>
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
  margin-left: auto;
  padding: 3px 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-soft);
  border-radius: 6px;
  font-size: 12px;
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
  padding: 6px 14px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  border-radius: 8px;
  font-size: 13px;
}

.btns button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btns button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
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
}

textarea:focus {
  border-color: var(--primary);
}
</style>
