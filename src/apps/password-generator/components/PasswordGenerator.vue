<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { usePassword } from '../composables/usePassword.js'

const { t } = useI18n()

const {
  length, useUppercase, useLowercase, useNumbers, useSymbols,
  batchCount, passwords, hasCharType,
  generate, evaluateStrength
} = usePassword()

const copiedIndex = ref(-1)

function copyPassword(text, index) {
  navigator.clipboard.writeText(text).then(() => {
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 1500)
  })
}

function getStrengthClass(level) {
  return {
    weak: 'strength-weak',
    medium: 'strength-medium',
    strong: 'strength-strong',
    veryStrong: 'strength-very-strong'
  }[level]
}

function getStrengthWidth(level) {
  return { weak: '25%', medium: '50%', strong: '75%', veryStrong: '100%' }[level]
}

function getCrackTimeText(strength) {
  if (!strength) return ''
  if (strength.crackTimeKey === 'instantly') return t('passwordGenerator.instantly')
  if (strength.crackTimeKey === 'centuries') return t('passwordGenerator.centuries')
  return t('passwordGenerator.' + strength.crackTimeKey, { count: strength.crackTimeValue })
}
</script>

<template>
  <div class="password-generator">
    <div class="settings">
      <div class="setting-row">
        <label>{{ t('passwordGenerator.length') }}: {{ length }}</label>
        <input type="range" v-model.number="length" min="4" max="128" class="slider" />
      </div>
      <div class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="useUppercase" /> {{ t('passwordGenerator.uppercase') }}
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useLowercase" /> {{ t('passwordGenerator.lowercase') }}
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useNumbers" /> {{ t('passwordGenerator.numbers') }}
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useSymbols" /> {{ t('passwordGenerator.symbols') }}
        </label>
      </div>
      <div class="setting-row">
        <label>{{ t('passwordGenerator.batchCount') }}: {{ batchCount }}</label>
        <input type="range" v-model.number="batchCount" min="1" max="20" class="slider" />
      </div>
      <div class="warning" v-if="!hasCharType">{{ t('passwordGenerator.noTypeSelected') }}</div>
      <button class="btn-generate" @click="generate" :disabled="!hasCharType">
        {{ t('passwordGenerator.generate') }}
      </button>
    </div>
    <div class="results" v-if="passwords.length">
      <div v-for="(pwd, index) in passwords" :key="index" class="password-item">
        <div class="password-text">{{ pwd }}</div>
        <button class="btn-copy" @click="copyPassword(pwd, index)">
          {{ copiedIndex === index ? t('passwordGenerator.copied') : t('passwordGenerator.copy') }}
        </button>
        <div class="strength-info" v-if="batchCount === 1">
          <div class="strength-bar">
            <div
              :class="['strength-fill', getStrengthClass(evaluateStrength(pwd).level)]"
              :style="{ width: getStrengthWidth(evaluateStrength(pwd).level) }"
            ></div>
          </div>
          <span :class="['strength-label', getStrengthClass(evaluateStrength(pwd).level)]">
            {{ t('passwordGenerator.' + evaluateStrength(pwd).level) }}
          </span>
          <span class="crack-time">{{ t('passwordGenerator.crackTime') }}: {{ getCrackTimeText(evaluateStrength(pwd)) }}</span>
        </div>
      </div>
    </div>
    <div class="placeholder" v-else>
      {{ t('passwordGenerator.passwordPlaceholder') }}
    </div>
  </div>
</template>

<style scoped>
.password-generator {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.setting-row label {
  font-size: 13px;
  color: #555;
  white-space: nowrap;
  min-width: 100px;
}
.slider {
  flex: 1;
  accent-color: #4a90d9;
}
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.checkbox-label {
  font-size: 13px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.checkbox-label input {
  accent-color: #4a90d9;
}
.warning {
  font-size: 12px;
  color: #e74c3c;
}
.btn-generate {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-start;
}
.btn-generate:hover:not(:disabled) {
  background: #3a7bc8;
}
.btn-generate:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.password-item {
  padding: 10px 12px;
  background: #f9f9f9;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.password-text {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: #333;
  word-break: break-all;
  min-width: 200px;
}
.btn-copy {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-copy:hover {
  background: #f0f0f0;
}
.strength-info {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.strength-bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}
.strength-weak { background: #e74c3c; }
.strength-medium { background: #f39c12; }
.strength-strong { background: #27ae60; }
.strength-very-strong { background: #2ecc71; }
.strength-label {
  font-size: 11px;
  font-weight: 600;
  min-width: 40px;
}
.strength-label.strength-weak { color: #e74c3c; }
.strength-label.strength-medium { color: #f39c12; }
.strength-label.strength-strong { color: #27ae60; }
.strength-label.strength-very-strong { color: #2ecc71; }
.crack-time {
  font-size: 11px;
  color: #888;
}
.placeholder {
  text-align: center;
  color: #bbb;
  padding: 20px;
  font-size: 14px;
}
</style>
