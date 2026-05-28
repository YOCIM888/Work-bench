<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n/index.js'
import TimestampInput from './components/TimestampInput.vue'
import DateTimeInput from './components/DateTimeInput.vue'
import ConversionResult from './components/ConversionResult.vue'
import LiveClock from './components/LiveClock.vue'
import { useTimestamp } from './composables/useTimestamp.js'

const { t } = useI18n()

const {
  timestampInput, dateTimeInput, selectedTimezone,
  currentTimestamp, currentDateTime,
  isSeconds, convertedDate, convertedTimestamp,
  getFormats, useCurrentTime, useCurrentDateTime,
  formatDateLocal
} = useTimestamp()

const activeTab = ref('timestamp')

const timestampFormats = computed(() => {
  return getFormats(convertedDate.value)
})

const dateTimeFormats = computed(() => {
  if (convertedTimestamp.value === null) return []
  const d = new Date(convertedTimestamp.value * 1000)
  if (isNaN(d.getTime())) return []
  return getFormats(d)
})

const timestampError = computed(() => {
  if (!timestampInput.value) return null
  if (!convertedDate.value) return t('timestampConverter.invalidTimestamp')
  return null
})

const dateTimeError = computed(() => {
  if (!dateTimeInput.value) return null
  if (convertedTimestamp.value === null) return t('timestampConverter.invalidDate')
  return null
})
</script>

<template>
  <div class="timestamp-converter-app">
    <LiveClock
      :current-date-time="currentDateTime"
      :current-timestamp="currentTimestamp"
      :format-date-local="formatDateLocal"
      class="clock-section"
    />
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'timestamp' }]"
        @click="activeTab = 'timestamp'"
      >
        {{ t('timestampConverter.timestampInput') }} → {{ t('timestampConverter.dateTimeInput') }}
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'datetime' }]"
        @click="activeTab = 'datetime'"
      >
        {{ t('timestampConverter.dateTimeInput') }} → {{ t('timestampConverter.timestampInput') }}
      </button>
    </div>
    <div class="converter-body">
      <div v-if="activeTab === 'timestamp'" class="converter-section">
        <TimestampInput
          v-model="timestampInput"
          :is-seconds="isSeconds"
          @use-current="useCurrentTime"
          @convert="() => {}"
        />
        <ConversionResult
          :formats="timestampFormats"
          :error="timestampError"
        />
      </div>
      <div v-else class="converter-section">
        <DateTimeInput
          v-model="dateTimeInput"
          @use-current="useCurrentDateTime"
          @convert="() => {}"
        />
        <ConversionResult
          :formats="dateTimeFormats"
          :error="dateTimeError"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.timestamp-converter-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 16px;
  overflow-y: auto;
}
.clock-section {
  flex-shrink: 0;
}
.tabs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.tab-btn:hover:not(.active) {
  background: #f0f0f0;
}
.converter-body {
  flex: 1;
  min-height: 0;
}
.converter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
