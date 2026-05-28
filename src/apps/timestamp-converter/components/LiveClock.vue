<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  currentDateTime: { type: Date, default: null },
  currentTimestamp: { type: Number, default: 0 },
  formatDateLocal: { type: Function, required: true }
})
</script>

<template>
  <div class="live-clock">
    <div class="clock-header">{{ t('timestampConverter.liveClock') }}</div>
    <div class="clock-body">
      <div class="clock-time">{{ formatDateLocal(currentDateTime) }}</div>
      <div class="clock-ts">
        <span class="ts-label">{{ t('timestampConverter.currentTimestamp') }}:</span>
        <span class="ts-value">{{ currentTimestamp }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-clock {
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
}
.clock-header {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  background: #f9f9f9;
  border-bottom: 1px solid #e5e5e5;
}
.clock-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.clock-time {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.clock-ts {
  display: flex;
  gap: 6px;
  align-items: center;
}
.ts-label {
  font-size: 12px;
  color: #888;
}
.ts-value {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: #4a90d9;
  font-weight: 500;
}
</style>
