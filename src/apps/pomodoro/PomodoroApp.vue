<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { usePomodoro } from './composables/usePomodoro.js'

const { t } = useI18n()

const {
  settings, phase, currentRound, isRunning,
  progress, displayTime, showNotification,
  start, pause, reset, skip, resetRounds
} = usePomodoro()

const showSettings = ref(false)

function getPhaseColor() {
  if (phase.value === 'work') return '#e74c3c'
  if (phase.value === 'shortBreak') return '#27ae60'
  return '#3498db'
}

function getPhaseLabel() {
  if (phase.value === 'work') return t('pomodoro.work')
  if (phase.value === 'shortBreak') return t('pomodoro.shortBreak')
  return t('pomodoro.longBreak')
}

const circumference = 2 * Math.PI * 90
const strokeDashoffset = circumference * (1 - progress.value)
</script>

<template>
  <div class="pomodoro-app">
    <div class="notification" v-if="showNotification">
      <span>{{ t('pomodoro.' + showNotification) }}</span>
      <button class="notif-close" @click="showNotification = null">✕</button>
    </div>

    <div class="timer-section">
      <div class="phase-tabs">
        <button
          :class="['phase-tab', { active: phase === 'work' }]"
          @click="phase !== 'work' || resetRounds(); phase = 'work'; timeRemaining = settings.workMinutes * 60"
          :style="{ '--active-color': '#e74c3c' }"
        >{{ t('pomodoro.work') }}</button>
        <button
          :class="['phase-tab', { active: phase === 'shortBreak' }]"
          @click="phase = 'shortBreak'; timeRemaining = settings.shortBreakMinutes * 60"
          :style="{ '--active-color': '#27ae60' }"
        >{{ t('pomodoro.shortBreak') }}</button>
        <button
          :class="['phase-tab', { active: phase === 'longBreak' }]"
          @click="phase = 'longBreak'; timeRemaining = settings.longBreakMinutes * 60"
          :style="{ '--active-color': '#3498db' }"
        >{{ t('pomodoro.longBreak') }}</button>
      </div>

      <div class="timer-circle">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#eee" stroke-width="6" />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            :stroke="getPhaseColor()"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference * (1 - progress)"
            transform="rotate(-90 100 100)"
            style="transition: stroke-dashoffset 0.5s"
          />
        </svg>
        <div class="timer-text">
          <div class="timer-time">{{ displayTime }}</div>
          <div class="timer-phase" :style="{ color: getPhaseColor() }">{{ getPhaseLabel() }}</div>
        </div>
      </div>

      <div class="round-info">
        {{ t('pomodoro.round', { current: currentRound, total: settings.longBreakInterval }) }}
      </div>

      <div class="controls">
        <button class="btn-control" @click="reset" :title="t('pomodoro.reset')">↺</button>
        <button
          class="btn-main"
          @click="isRunning ? pause() : start()"
          :style="{ background: getPhaseColor() }"
        >
          {{ isRunning ? t('pomodoro.pause') : t('pomodoro.start') }}
        </button>
        <button class="btn-control" @click="skip" :title="t('pomodoro.skip')">⏭</button>
      </div>
    </div>

    <div class="stats-bar">
      <span>{{ t('pomodoro.totalCompleted') }}: <strong>{{ settings.completedToday }}</strong> {{ t('pomodoro.pomodoros') }}</span>
    </div>

    <div class="settings-toggle">
      <button class="btn-settings" @click="showSettings = !showSettings">
        {{ t('pomodoro.settings') }}
      </button>
    </div>

    <div class="settings-panel" v-if="showSettings">
      <div class="setting-row">
        <label>{{ t('pomodoro.workMinutes') }}</label>
        <input type="number" v-model.number="settings.workMinutes" min="1" max="120" class="setting-input" />
      </div>
      <div class="setting-row">
        <label>{{ t('pomodoro.shortBreakMinutes') }}</label>
        <input type="number" v-model.number="settings.shortBreakMinutes" min="1" max="60" class="setting-input" />
      </div>
      <div class="setting-row">
        <label>{{ t('pomodoro.longBreakMinutes') }}</label>
        <input type="number" v-model.number="settings.longBreakMinutes" min="1" max="60" class="setting-input" />
      </div>
      <div class="setting-row">
        <label>{{ t('pomodoro.longBreakInterval') }}</label>
        <input type="number" v-model.number="settings.longBreakInterval" min="2" max="10" class="setting-input" />
        <span class="setting-unit">{{ t('pomodoro.sessions') }}</span>
      </div>
      <div class="setting-row">
        <label>{{ t('pomodoro.autoStart') }}</label>
        <input type="checkbox" v-model="settings.autoStart" />
      </div>
      <div class="setting-row">
        <label>{{ t('pomodoro.sound') }}</label>
        <input type="checkbox" v-model="settings.sound" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 16px;
  overflow-y: auto;
}
.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 14px;
  background: #f0f7ff;
  border: 1px solid #b3d4fc;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
}
.notif-close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #888;
}
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.phase-tabs {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 3px;
}
.phase-tab {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}
.phase-tab.active {
  background: var(--active-color, #e74c3c);
  color: #fff;
}
.phase-tab:hover:not(.active) {
  background: #e0e0e0;
}
.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
}
.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.timer-time {
  font-size: 40px;
  font-weight: 700;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  line-height: 1;
}
.timer-phase {
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
}
.round-info {
  font-size: 13px;
  color: #888;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-main {
  padding: 10px 32px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-main:hover {
  opacity: 0.85;
}
.btn-control {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 16px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.btn-control:hover {
  background: #f0f0f0;
}
.stats-bar {
  font-size: 13px;
  color: #888;
  padding: 8px 16px;
  background: #f9f9f9;
  border-radius: 6px;
}
.stats-bar strong {
  color: #e74c3c;
  font-size: 16px;
}
.settings-toggle {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn-settings {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-settings:hover {
  background: #f0f0f0;
}
.settings-panel {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.setting-row label {
  font-size: 13px;
  color: #555;
}
.setting-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  outline: none;
}
.setting-input:focus {
  border-color: #4a90d9;
}
.setting-unit {
  font-size: 12px;
  color: #888;
}
.setting-row input[type="checkbox"] {
  accent-color: #4a90d9;
}
</style>
