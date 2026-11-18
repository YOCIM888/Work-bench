<script setup>
import { ref, onUnmounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const tab = ref('stopwatch')

// ===== 秒表 =====
const swElapsed = ref(0)
const swRunning = ref(false)
const laps = ref([])
let swAccum = 0
let swStart = 0
let swRaf = null

function swTick() {
  swElapsed.value = swAccum + (Date.now() - swStart)
  swRaf = requestAnimationFrame(swTick)
}

function swStartPause() {
  if (swRunning.value) {
    swAccum = swElapsed.value
    swRunning.value = false
    cancelAnimationFrame(swRaf)
  } else {
    swStart = Date.now()
    swRunning.value = true
    swRaf = requestAnimationFrame(swTick)
  }
}

function swReset() {
  swAccum = 0
  swElapsed.value = 0
  swRunning.value = false
  cancelAnimationFrame(swRaf)
  laps.value = []
}

function swLap() {
  if (!swRunning.value) return
  laps.value.unshift({ idx: laps.value.length + 1, time: swElapsed.value })
}

// ===== 倒计时 =====
const cdMinutes = ref(1)
const cdSeconds = ref(0)
const cdRemaining = ref(60000)
const cdRunning = ref(false)
let cdEnd = 0
let cdRaf = null

function cdTick() {
  const r = cdEnd - Date.now()
  if (r <= 0) {
    cdRemaining.value = 0
    cdRunning.value = false
    beep()
    return
  }
  cdRemaining.value = r
  cdRaf = requestAnimationFrame(cdTick)
}

function cdStartPause() {
  if (cdRunning.value) {
    cdRunning.value = false
    cancelAnimationFrame(cdRaf)
  } else {
    if (cdRemaining.value <= 0) cdRemaining.value = cdMinutes.value * 60000 + cdSeconds.value * 1000
    if (cdRemaining.value <= 0) return
    cdEnd = Date.now() + cdRemaining.value
    cdRunning.value = true
    cdRaf = requestAnimationFrame(cdTick)
  }
}

function cdReset() {
  cdRunning.value = false
  cancelAnimationFrame(cdRaf)
  cdRemaining.value = cdMinutes.value * 60000 + cdSeconds.value * 1000
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.value = 0.3
    osc.start()
    setTimeout(() => {
      osc.stop()
      ctx.close()
    }, 500)
  } catch (e) {
    // 忽略音频错误
  }
}

function setPreset(ms) {
  cdRunning.value = false
  cancelAnimationFrame(cdRaf)
  cdMinutes.value = Math.floor(ms / 60000)
  cdSeconds.value = Math.floor((ms % 60000) / 1000)
  cdRemaining.value = ms
}

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 10))
  const cs = total % 100
  const s = Math.floor(total / 100) % 60
  const m = Math.floor(total / 6000) % 60
  const h = Math.floor(total / 360000)
  const pad = (n, l = 2) => String(n).padStart(l, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}` : `${pad(m)}:${pad(s)}.${pad(cs)}`
}

function formatCd(ms) {
  const total = Math.ceil(ms / 1000)
  const s = total % 60
  const m = Math.floor(total / 60) % 60
  const h = Math.floor(total / 3600)
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

onUnmounted(() => {
  cancelAnimationFrame(swRaf)
  cancelAnimationFrame(cdRaf)
})

cdReset()
</script>

<template>
  <ToolLayout icon="⏲️" title="秒表与倒计时" description="精确到百分秒的秒表（支持计圈）与倒计时（到点提醒）。">
    <div class="tabs">
      <button :class="{ active: tab === 'stopwatch' }" @click="tab = 'stopwatch'">秒表</button>
      <button :class="{ active: tab === 'countdown' }" @click="tab = 'countdown'">倒计时</button>
    </div>

    <!-- 秒表 -->
    <div v-if="tab === 'stopwatch'" class="sw">
      <div class="display">{{ formatTime(swElapsed) }}</div>
      <div class="controls">
        <button class="primary" @click="swStartPause">{{ swRunning ? '暂停' : '开始' }}</button>
        <button @click="swLap" :disabled="!swRunning">计圈</button>
        <button class="ghost" @click="swReset">重置</button>
      </div>
      <div v-if="laps.length" class="laps">
        <div v-for="lap in laps" :key="lap.idx" class="lap">
          <span class="lap-idx">圈 {{ lap.idx }}</span>
          <span class="lap-time">{{ formatTime(lap.time) }}</span>
        </div>
      </div>
    </div>

    <!-- 倒计时 -->
    <div v-else class="cd">
      <div class="display" :class="{ done: cdRemaining === 0 }">{{ formatCd(cdRemaining) }}</div>
      <div class="cd-setup">
        <label>分<input type="number" v-model.number="cdMinutes" min="0" @change="cdReset" :disabled="cdRunning" /></label>
        <label>秒<input type="number" v-model.number="cdSeconds" min="0" max="59" @change="cdReset" :disabled="cdRunning" /></label>
      </div>
      <div class="presets">
        <button @click="setPreset(60000)" :disabled="cdRunning">1 分钟</button>
        <button @click="setPreset(300000)" :disabled="cdRunning">5 分钟</button>
        <button @click="setPreset(600000)" :disabled="cdRunning">10 分钟</button>
        <button @click="setPreset(1500000)" :disabled="cdRunning">25 分钟</button>
      </div>
      <div class="controls">
        <button class="primary" @click="cdStartPause">{{ cdRunning ? '暂停' : '开始' }}</button>
        <button class="ghost" @click="cdReset">重置</button>
      </div>
      <div v-if="cdRemaining === 0" class="done-msg">⏰ 时间到！</div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-soft);
  border-radius: 8px;
  font-size: 14px;
}

.tabs button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.display {
  font-size: 48px;
  font-weight: 800;
  text-align: center;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--text);
  padding: 24px 0;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
}

.display.done {
  color: var(--danger);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.controls button {
  padding: 10px 24px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  border-radius: 8px;
  font-size: 14px;
}

.controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls button.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.controls button.ghost {
  background: transparent;
}

.cd-setup {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 12px;
}

.cd-setup label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-soft);
}

.cd-setup input {
  width: 70px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.cd-setup input:disabled {
  background: var(--bg-soft);
}

.presets {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.presets button {
  padding: 6px 14px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-soft);
  border-radius: 20px;
  font-size: 12px;
}

.presets button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.laps {
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
}

.lap {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

.lap-idx {
  color: var(--text-soft);
}

.lap-time {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-weight: 600;
}

.done-msg {
  text-align: center;
  margin-top: 16px;
  font-size: 16px;
  color: var(--danger);
  font-weight: 600;
}
</style>
