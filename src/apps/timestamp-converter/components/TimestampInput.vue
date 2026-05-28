<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  isSeconds: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'use-current', 'convert'])
</script>

<template>
  <div class="timestamp-input">
    <label class="input-label">{{ t('timestampConverter.timestampInput') }}</label>
    <div class="input-row">
      <input
        class="ts-input"
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="1748505600"
        spellcheck="false"
      />
      <span class="unit-badge">
        {{ t('timestampConverter.autoDetected', { unit: isSeconds ? t('timestampConverter.seconds') : t('timestampConverter.milliseconds') }) }}
      </span>
    </div>
    <div class="input-actions">
      <button class="btn-secondary" @click="$emit('use-current')">{{ t('timestampConverter.useCurrent') }}</button>
      <button class="btn-primary" @click="$emit('convert')">{{ t('timestampConverter.convert') }}</button>
    </div>
  </div>
</template>

<style scoped>
.timestamp-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
}
.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.ts-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: #333;
  outline: none;
}
.ts-input:focus {
  border-color: #4a90d9;
}
.ts-input::placeholder {
  color: #bbb;
}
.unit-badge {
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}
.input-actions {
  display: flex;
  gap: 8px;
}
.btn-primary {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover {
  background: #3a7bc8;
}
.btn-secondary {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover {
  background: #f0f0f0;
}
</style>
