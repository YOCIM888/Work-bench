<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const height = ref(170)
const weight = ref(65)

const bmi = computed(() => {
  const h = height.value / 100
  if (h <= 0 || weight.value <= 0) return 0
  return weight.value / (h * h)
})

const category = computed(() => {
  const b = bmi.value
  if (!b) return { label: '—', color: 'var(--text-soft)', range: '' }
  if (b < 18.5) return { label: '偏瘦', color: 'var(--warning-fg)', range: '< 18.5' }
  if (b < 24) return { label: '正常', color: 'var(--success-fg)', range: '18.5 – 24' }
  if (b < 28) return { label: '超重', color: 'var(--warning-fg)', range: '24 – 28' }
  return { label: '肥胖', color: 'var(--danger-fg)', range: '≥ 28' }
})

// 量表位置（0-100%）
const gaugePos = computed(() => {
  const b = bmi.value
  if (!b) return 0
  // 映射 15-35 到 0-100
  return Math.max(0, Math.min(100, ((b - 15) / 20) * 100))
})
</script>

<template>
  <ToolLayout icon="⚖️" title="BMI 计算器" description="根据身高体重计算身体质量指数 (BMI) 并给出分类（中国标准）。">
    <div class="inputs">
      <label class="inp">
        <span>身高</span>
        <input type="number" v-model.number="height" min="50" max="250" />
        <em>cm</em>
      </label>
      <label class="inp">
        <span>体重</span>
        <input type="number" v-model.number="weight" min="10" max="300" />
        <em>kg</em>
      </label>
    </div>

    <div class="result">
      <div class="bmi-num">{{ bmi ? bmi.toFixed(1) : '—' }}</div>
      <div class="cat" :style="{ color: category.color }">{{ category.label }}</div>
      <div class="range">{{ category.range }}</div>
    </div>

    <div class="gauge">
      <div class="track">
        <div class="seg thin"></div>
        <div class="seg normal"></div>
        <div class="seg over"></div>
        <div class="seg obese"></div>
        <div class="pointer" :style="{ left: gaugePos + '%' }"></div>
      </div>
      <div class="labels">
        <span>偏瘦</span><span>正常</span><span>超重</span><span>肥胖</span>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.inp {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-soft);
}

.inp input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  font-weight: 400;
}

.inp input:focus {
  border-color: var(--primary);
}

.inp em {
  font-style: normal;
  color: var(--text-soft);
  font-size: 13px;
}

.result {
  text-align: center;
  margin-bottom: 28px;
}

.bmi-num {
  font-size: 48px;
  font-weight: 800;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--text);
  line-height: 1.2;
}

.cat {
  font-size: 20px;
  font-weight: 700;
}

.range {
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 4px;
}

.gauge {
  margin-top: 8px;
}

.track {
  position: relative;
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.seg {
  flex: 1;
}

.seg.thin {
  background: var(--warning-tint);
}

.seg.normal {
  background: var(--success-tint);
}

.seg.over {
  background: var(--warning-tint);
}

.seg.obese {
  background: var(--danger-tint);
}

.pointer {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 20px;
  background: var(--text);
  border-radius: 2px;
  transform: translateX(-50%);
  transition: left 0.2s;
  box-shadow: 0 0 0 2px var(--bg-card);
}

.labels {
  display: flex;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-soft);
}

.labels span {
  flex: 1;
  text-align: center;
}
</style>
