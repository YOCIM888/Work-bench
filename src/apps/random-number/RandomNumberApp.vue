<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const min = ref(1)
const max = ref(100)
const count = ref(1)
const unique = ref(false)
const result = ref('')
const error = ref('')

function generate() {
  error.value = ''
  const lo = Math.min(min.value, max.value)
  const hi = Math.max(min.value, max.value)
  const range = hi - lo + 1
  const n = Math.max(0, count.value)
  if (unique.value && n > range) {
    error.value = `唯一模式下数量不能超过范围大小 (${range})`
    result.value = ''
    return
  }
  const arr = []
  if (unique.value) {
    const set = new Set()
    while (set.size < n) set.add(lo + Math.floor(Math.random() * range))
    arr.push(...set)
  } else {
    for (let i = 0; i < n; i++) arr.push(lo + Math.floor(Math.random() * range))
  }
  result.value = arr.join(', ')
}

generate()
</script>

<template>
  <ToolLayout icon="🎲" title="随机数生成器" description="在指定范围内生成一个或多个随机整数。">
    <div class="opts">
      <label class="opt">最小值<input type="number" v-model.number="min" @change="generate" /></label>
      <label class="opt">最大值<input type="number" v-model.number="max" @change="generate" /></label>
      <label class="opt">数量<input type="number" min="1" max="1000" v-model.number="count" @change="generate" /></label>
      <label class="check"><input type="checkbox" v-model="unique" @change="generate" /> 不重复</label>
    </div>

    <div class="actions">
      <button class="primary" @click="generate">🎲 生成</button>
      <button class="ghost" @click="copy(result)" :disabled="!result">复制结果</button>
    </div>

    <div class="result">
      <div v-if="error" class="err">⚠ {{ error }}</div>
      <div v-else class="nums">{{ result || '—' }}</div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.opts {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.opt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
}

.opt input {
  width: 100px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-weight: 400;
}

.check {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
}

button.primary {
  background: var(--primary);
  color: #fff;
}

button.primary:hover {
  background: var(--primary-hover);
}

button.ghost {
  background: transparent;
  color: var(--text-soft);
  border: 1px solid var(--border);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.result {
  padding: 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-height: 60px;
  word-break: break-all;
}

.nums {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.6;
}

.err {
  color: var(--danger);
  font-size: 13px;
}
</style>
