<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  fields: { type: Object, required: true },
  fieldNames: { type: Array, required: true },
  fieldRanges: { type: Object, required: true }
})

const modes = ['every', 'specific', 'range', 'step']
</script>

<template>
  <div class="cron-builder">
    <div v-for="fieldName in fieldNames" :key="fieldName" class="field-row">
      <span class="field-label">{{ t('cronGenerator.' + fieldName) }}</span>
      <div class="field-modes">
        <button
          v-for="m in modes"
          :key="m"
          :class="['mode-btn', { active: fields[fieldName].mode === m }]"
          @click="fields[fieldName].mode = m"
        >{{ t('cronGenerator.' + m) }}</button>
      </div>
      <div class="field-inputs">
        <template v-if="fields[fieldName].mode === 'specific'">
          <input
            v-model="fields[fieldName].value"
            type="text"
            class="field-input"
            :placeholder="fieldName === 'weekday' ? '1,3,5' : '0,15,30'"
          />
        </template>
        <template v-else-if="fields[fieldName].mode === 'range'">
          <span class="input-label">{{ t('cronGenerator.from') }}</span>
          <input v-model="fields[fieldName].from" type="number" class="field-input small" :min="fieldRanges[fieldName].min" :max="fieldRanges[fieldName].max" />
          <span class="input-label">{{ t('cronGenerator.to') }}</span>
          <input v-model="fields[fieldName].to" type="number" class="field-input small" :min="fieldRanges[fieldName].min" :max="fieldRanges[fieldName].max" />
        </template>
        <template v-else-if="fields[fieldName].mode === 'step'">
          <span class="input-label">{{ t('cronGenerator.stepValue') }}</span>
          <input v-model="fields[fieldName].step" type="number" class="field-input small" min="1" :max="fieldRanges[fieldName].max" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cron-builder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}
.field-label {
  min-width: 50px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}
.field-modes {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 2px;
}
.mode-btn {
  padding: 3px 8px;
  border: none;
  border-radius: 3px;
  background: transparent;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.mode-btn.active {
  background: #4a90d9;
  color: #fff;
}
.field-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}
.field-input {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  width: 80px;
  outline: none;
}
.field-input:focus {
  border-color: #4a90d9;
}
.field-input.small {
  width: 50px;
}
.input-label {
  font-size: 11px;
  color: #888;
}
</style>
