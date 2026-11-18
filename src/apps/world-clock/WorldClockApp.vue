<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const zones = [
  { city: '北京', tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { city: '东京', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: '新加坡', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { city: '迪拜', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { city: '伦敦', tz: 'Europe/London', flag: '🇬🇧' },
  { city: '巴黎', tz: 'Europe/Paris', flag: '🇫🇷' },
  { city: '纽约', tz: 'America/New_York', flag: '🇺🇸' },
  { city: '洛杉矶', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: '悉尼', tz: 'Australia/Sydney', flag: '🇦🇺' }
]

const now = ref(new Date())
let timer

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => clearInterval(timer))

function time(tz) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: tz,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now.value)
}

function date(tz) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).format(now.value)
}

// 本地时区是否为白天
function isDay(tz) {
  const h = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, hour: '2-digit' }).format(now.value)
  )
  return h >= 6 && h < 18
}
</script>

<template>
  <ToolLayout icon="🌍" title="世界时钟" description="实时显示全球主要城市的当前时间与日期。">
    <div class="grid">
      <div v-for="z in zones" :key="z.tz" class="card" :class="{ night: !isDay(z.tz) }">
        <div class="city">
          <span class="flag">{{ z.flag }}</span>
          <span>{{ z.city }}</span>
          <span class="moon">{{ isDay(z.tz) ? '☀️' : '🌙' }}</span>
        </div>
        <div class="time">{{ time(z.tz) }}</div>
        <div class="date">{{ date(z.tz) }}</div>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.card {
  padding: 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.15s;
}

.card:hover {
  border-color: var(--primary);
}

.card.night {
  background: var(--code-bg);
  border-color: var(--border);
}

.card.night .city,
.card.night .date {
  color: var(--text-soft);
}

.city {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.flag {
  font-size: 18px;
}

.moon {
  margin-left: auto;
}

.time {
  font-size: 28px;
  font-weight: 800;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.date {
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 4px;
}
</style>
