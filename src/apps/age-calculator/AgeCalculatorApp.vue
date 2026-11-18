<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const today = new Date().toISOString().slice(0, 10)
const start = ref('2000-01-01')
const end = ref(today)

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

const result = computed(() => {
  const s = new Date(start.value)
  const e = new Date(end.value)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null
  if (s > e) return { error: '起始日期不能晚于结束日期' }
  let y = e.getFullYear() - s.getFullYear()
  let m = e.getMonth() - s.getMonth()
  let d = e.getDate() - s.getDate()
  if (d < 0) {
    m--
    d += daysInMonth(e.getFullYear(), e.getMonth() - 1)
  }
  if (m < 0) {
    y--
    m += 12
  }
  const ms = e - s
  const totalDays = Math.floor(ms / 86400000)
  return {
    y,
    m,
    d,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalHours: Math.floor(ms / 3600000),
    totalMinutes: Math.floor(ms / 60000),
    nextBirthdayDays: nextBirthdayDays(s, e)
  }
})

function nextBirthdayDays(birth, now) {
  const year = now.getFullYear()
  let next = new Date(year, birth.getMonth(), birth.getDate())
  if (next < now) next = new Date(year + 1, birth.getMonth(), birth.getDate())
  return Math.ceil((next - now) / 86400000)
}
</script>

<template>
  <ToolLayout icon="🎂" title="年龄计算器" description="计算两个日期之间的精确时长，含下一个生日倒计时。">
    <div class="dates">
      <label class="d">
        起始日期
        <input type="date" v-model="start" />
      </label>
      <label class="d">
        结束日期
        <input type="date" v-model="end" />
      </label>
    </div>

    <div v-if="result?.error" class="err">{{ result.error }}</div>

    <div v-if="result && !result.error" class="result">
      <div class="main">
        <span class="big">{{ result.y }}</span> 岁
        <span class="big">{{ result.m }}</span> 个月
        <span class="big">{{ result.d }}</span> 天
      </div>
      <div class="grid">
        <div class="item"><div class="num">{{ result.totalDays.toLocaleString() }}</div><div class="lbl">总天数</div></div>
        <div class="item"><div class="num">{{ result.totalWeeks.toLocaleString() }}</div><div class="lbl">总周数</div></div>
        <div class="item"><div class="num">{{ result.totalHours.toLocaleString() }}</div><div class="lbl">总小时</div></div>
        <div class="item"><div class="num">{{ result.totalMinutes.toLocaleString() }}</div><div class="lbl">总分钟</div></div>
      </div>
      <div class="bday">🎂 距下一个生日还有 <strong>{{ result.nextBirthdayDays }}</strong> 天</div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.d {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
}

.d input {
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-weight: 400;
}

.d input:focus {
  border-color: var(--primary);
}

.err {
  color: var(--danger);
  font-size: 14px;
}

.main {
  font-size: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--primary-tint);
  border-radius: 10px;
  text-align: center;
}

.big {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
  font-family: 'SFMono-Regular', Consolas, monospace;
  margin: 0 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.item {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.num {
  font-size: 18px;
  font-weight: 700;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lbl {
  font-size: 11px;
  color: var(--text-soft);
  margin-top: 4px;
}

.bday {
  padding: 12px;
  background: var(--warning-tint);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.bday strong {
  color: var(--warning-fg);
  font-size: 16px;
}
</style>
