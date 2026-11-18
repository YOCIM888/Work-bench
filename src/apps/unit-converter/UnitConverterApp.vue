<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const category = ref('长度')
const inputValue = ref(1)
const fromUnit = ref('m')

const categories = {
  长度: { base: 'm', units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 } },
  重量: { base: 'kg', units: { kg: 1, g: 0.001, mg: 0.000001, t: 1000, lb: 0.45359237, oz: 0.028349523 } },
  数据存储: { base: 'B', units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 } },
  面积: { base: 'm²', units: { 'm²': 1, 'km²': 1000000, 'cm²': 0.0001, 'ha': 10000, 'acre': 4046.8564224, 'ft²': 0.09290304 } },
  速度: { base: 'm/s', units: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'kn': 0.514444 } }
}

// 温度特殊处理
const tempUnits = ['°C', '°F', 'K']

function toCelsius(v, unit) {
  if (unit === '°C') return v
  if (unit === '°F') return (v - 32) * (5 / 9)
  return v - 273.15
}
function fromCelsius(c, unit) {
  if (unit === '°C') return c
  if (unit === '°F') return c * (9 / 5) + 32
  return c + 273.15
}

const currentUnits = computed(() => {
  if (category.value === '温度') return tempUnits
  return Object.keys(categories[category.value].units)
})

const results = computed(() => {
  const v = Number(inputValue.value)
  if (isNaN(v)) return []
  if (category.value === '温度') {
    const c = toCelsius(v, fromUnit.value)
    return tempUnits.map((u) => ({ unit: u, value: fromCelsius(c, u) }))
  }
  const cat = categories[category.value]
  const baseValue = v * cat.units[fromUnit.value]
  return Object.entries(cat.units).map(([u, factor]) => ({
    unit: u,
    value: baseValue / factor
  }))
})

function formatNum(n) {
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e9 || abs < 1e-4) return n.toExponential(4)
  if (abs >= 1) return parseFloat(n.toFixed(6)).toString()
  return parseFloat(n.toFixed(8)).toString()
}

function onCategoryChange() {
  fromUnit.value = currentUnits.value[0]
}
</script>

<template>
  <ToolLayout icon="⚖️" title="单位换算" description="长度、重量、温度、数据存储、面积、速度的单位换算。">
    <div class="opts">
      <label class="opt">类别
        <select v-model="category" @change="onCategoryChange">
          <option v-for="c in Object.keys(categories)" :key="c" :value="c">{{ c }}</option>
          <option value="温度">温度</option>
        </select>
      </label>
      <label class="opt">数值
        <input type="number" v-model.number="inputValue" step="any" />
      </label>
      <label class="opt">单位
        <select v-model="fromUnit">
          <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
        </select>
      </label>
    </div>

    <div class="results">
      <div v-for="r in results" :key="r.unit" class="result" :class="{ active: r.unit === fromUnit }">
        <div class="val">{{ formatNum(r.value) }}</div>
        <div class="unit">{{ r.unit }}</div>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.opts {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.opt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
}

.opt select,
.opt input {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-weight: 400;
  min-width: 120px;
}

.opt input:focus,
.opt select:focus {
  border-color: var(--primary);
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.result {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.result.active {
  background: var(--primary-tint);
  border-color: var(--primary);
}

.val {
  font-size: 18px;
  font-weight: 700;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--text);
  word-break: break-all;
}

.result.active .val {
  color: var(--primary);
}

.unit {
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 4px;
}
</style>
