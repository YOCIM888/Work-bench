<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const type = ref('linear')
const angle = ref(135)
const stops = ref([
  { color: '#6366f1', pos: 0 },
  { color: '#ec4899', pos: 100 }
])

const css = computed(() => {
  const stopsStr = stops.value.map((s) => `${s.color} ${s.pos}%`).join(', ')
  if (type.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${stopsStr})`
  }
  return `radial-gradient(circle, ${stopsStr})`
})

function addStop() {
  stops.value.push({ color: '#8b5cf6', pos: 50 })
}

function removeStop(i) {
  if (stops.value.length > 2) stops.value.splice(i, 1)
}
</script>

<template>
  <ToolLayout icon="🌈" title="CSS 渐变生成器" description="可视化调整线性 / 径向渐变，实时预览并复制 CSS 代码。">
    <div class="preview" :style="{ background: css }"></div>

    <div class="opts">
      <label class="opt">类型
        <select v-model="type">
          <option value="linear">线性 linear</option>
          <option value="radial">径向 radial</option>
        </select>
      </label>
      <label v-if="type === 'linear'" class="opt">角度
        <input type="range" min="0" max="360" v-model.number="angle" /> {{ angle }}°
      </label>
    </div>

    <div class="stops">
      <div class="sub-title">颜色断点</div>
      <div v-for="(s, i) in stops" :key="i" class="stop">
        <input type="color" v-model="s.color" />
        <input type="range" min="0" max="100" v-model.number="s.pos" />
        <span class="pos">{{ s.pos }}%</span>
        <span class="hex">{{ s.color }}</span>
        <button class="rm" @click="removeStop(i)" :disabled="stops.length <= 2" title="删除">✕</button>
      </div>
      <button class="add" @click="addStop">+ 添加断点</button>
    </div>

    <div class="code-box">
      <div class="sub-title">CSS 代码</div>
      <div class="code">
        <code>background: {{ css }};</code>
        <button class="copy" @click="copy('background: ' + css + ';')">复制</button>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.preview {
  height: 160px;
  border-radius: 10px;
  border: 1px solid var(--border);
  margin-bottom: 16px;
}

.opts {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.opt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
}

.opt select {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
}

.opt input[type='range'] {
  width: 120px;
}

.sub-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 8px;
}

.stops {
  margin-bottom: 16px;
}

.stop {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stop input[type='color'] {
  width: 36px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
}

.stop input[type='range'] {
  width: 120px;
}

.pos {
  font-size: 12px;
  color: var(--text-soft);
  width: 36px;
}

.hex {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  color: var(--text);
}

.rm {
  padding: 3px 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--danger);
  border-radius: 6px;
  font-size: 11px;
}

.rm:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.add {
  padding: 6px 14px;
  border: 1px dashed var(--border);
  background: transparent;
  color: var(--text-soft);
  border-radius: 8px;
  font-size: 12px;
}

.code-box {
  margin-top: 8px;
}

.code {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--code-bg);
  border-radius: 8px;
}

.code code {
  flex: 1;
  color: var(--code-fg);
  font-size: 12px;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.copy {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}
</style>
