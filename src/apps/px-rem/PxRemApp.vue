<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const base = ref(16)
const px = ref(32)

const rem = computed({
  get: () => px.value / base.value,
  set: (v) => {
    px.value = v * base.value
  }
})

const em = computed({
  get: () => px.value / base.value,
  set: (v) => {
    px.value = v * base.value
  }
})

function formatNum(n) {
  return parseFloat(n.toFixed(4)).toString()
}
</script>

<template>
  <ToolLayout icon="📏" title="px / rem 转换" description="基于根字号在 px、rem、em 之间相互转换。">
    <div class="base">
      <label>根字号 (html font-size)</label>
      <input type="number" v-model.number="base" min="1" /> <span>px</span>
    </div>

    <div class="rows">
      <div class="row">
        <span class="lbl">px</span>
        <input type="number" v-model.number="px" step="any" />
      </div>
      <div class="row">
        <span class="lbl">rem</span>
        <input type="number" v-model.number="rem" step="any" />
      </div>
      <div class="row">
        <span class="lbl">em</span>
        <input type="number" v-model.number="em" step="any" />
      </div>
    </div>

    <div class="out">
      <code>{{ formatNum(px) }}px = {{ formatNum(rem) }}rem = {{ formatNum(em) }}em</code>
      <span class="note">(em 默认按根字号计算，等同于 rem)</span>
    </div>
  </ToolLayout>
</template>

<style scoped>
.base {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--text-soft);
  font-weight: 600;
}

.base input {
  width: 80px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-weight: 400;
}

.rows {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lbl {
  width: 48px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-soft);
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  outline: none;
}

.row input:focus {
  border-color: var(--primary);
}

.out {
  padding: 14px 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.out code {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.note {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-soft);
}
</style>
