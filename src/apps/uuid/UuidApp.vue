<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const count = ref(5)
const uppercase = ref(false)
const result = ref('')

// 生成 UUID v4（使用 crypto.randomUUID 优先，否则降级）
function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generate() {
  const list = []
  for (let i = 0; i < Math.min(count.value, 1000); i++) {
    list.push(uppercase.value ? uuidv4().toUpperCase() : uuidv4())
  }
  result.value = list.join('\n')
}

generate()
</script>

<template>
  <ToolLayout icon="🆔" title="UUID 生成器" description="批量生成 UUID v4（RFC 4122），浏览器本地生成。">
    <div class="opts">
      <label class="num">
        数量
        <input v-model.number="count" type="number" min="1" max="1000" />
      </label>
      <label class="up">
        <input type="checkbox" v-model="uppercase" /> 大写
      </label>
      <button @click="generate">生成</button>
      <button class="ghost" @click="copy(result)" :disabled="!result">复制全部</button>
    </div>

    <textarea :value="result" rows="12" readonly spellcheck="false"></textarea>
    <div class="count">共 {{ result ? result.split('\n').length : 0 }} 条</div>
  </ToolLayout>
</template>

<style scoped>
.opts {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.num {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-soft);
}

.num input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

.up {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

button {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 13px;
}

button:hover:not(:disabled) {
  background: var(--primary-hover);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

button.ghost {
  background: transparent;
  color: var(--text-soft);
  border: 1px solid var(--border);
  margin-left: auto;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  outline: none;
}

.count {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-soft);
}
</style>
