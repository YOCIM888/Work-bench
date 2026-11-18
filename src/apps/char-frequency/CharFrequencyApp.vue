<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const text = ref('the quick brown fox jumps over the lazy dog')
const ignoreSpace = ref(true)
const caseSensitive = ref(false)

const result = computed(() => {
  let t = text.value
  if (!caseSensitive.value) t = t.toLowerCase()
  if (ignoreSpace.value) t = t.replace(/\s/g, '')
  const map = new Map()
  for (const c of t) map.set(c, (map.get(c) || 0) + 1)
  const total = t.length
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => ({
      char: char === ' ' ? '␣' : char,
      count,
      percent: total ? (count / total) * 100 : 0
    }))
})

const total = computed(() => result.value.reduce((s, r) => s + r.count, 0))
</script>

<template>
  <ToolLayout icon="📊" title="字符频率统计" description="统计文本中每个字符的出现次数与占比，按频率降序排列。">
    <div class="pane">
      <div class="pane-title">输入文本</div>
      <textarea v-model="text" rows="5" spellcheck="false"></textarea>
    </div>

    <div class="opts">
      <label><input type="checkbox" v-model="ignoreSpace" /> 忽略空白字符</label>
      <label><input type="checkbox" v-model="caseSensitive" /> 区分大小写</label>
      <span class="total">共 {{ total }} 个字符 / {{ result.length }} 种</span>
    </div>

    <div class="list">
      <div v-for="(r, i) in result" :key="i" class="row">
        <span class="ch">{{ r.char }}</span>
        <div class="bar-wrap">
          <div class="bar" :style="{ width: r.percent + '%' }"></div>
        </div>
        <span class="count">{{ r.count }}</span>
        <span class="pct">{{ r.percent.toFixed(1) }}%</span>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.pane {
  margin-bottom: 14px;
}

.pane-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 6px;
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

.opts {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  font-size: 13px;
}

.opts label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.total {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-soft);
}

.list {
  max-height: 360px;
  overflow-y: auto;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 13px;
}

.ch {
  width: 24px;
  text-align: center;
  font-weight: 700;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.bar-wrap {
  flex: 1;
  height: 14px;
  background: var(--bg-hover);
  border-radius: 7px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: var(--primary);
  transition: width 0.2s;
}

.count {
  width: 50px;
  text-align: right;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-weight: 600;
}

.pct {
  width: 56px;
  text-align: right;
  color: var(--text-soft);
  font-size: 12px;
}
</style>
