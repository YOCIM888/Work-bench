<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  binValue: { type: String, default: '' },
  octValue: { type: String, default: '' },
  decDisplay: { type: String, default: '' },
  hexValue: { type: String, default: '' },
  bitWidth: { type: Number, default: 32 },
  inputErrors: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'update:bin', 'update:oct', 'update:dec', 'update:hex',
  'update:bitWidth'
])

const copied = ref({})

const widths = [8, 16, 32, 64]

const rows = [
  { key: 'bin', labelKey: 'bin', radix: 2 },
  { key: 'oct', labelKey: 'oct', radix: 8 },
  { key: 'dec', labelKey: 'dec', radix: 10 },
  { key: 'hex', labelKey: 'hex', radix: 16 }
]

function copyValue(key, value) {
  const cleaned = value.replace(/\s/g, '')
  navigator.clipboard.writeText(cleaned).then(() => {
    copied.value[key] = true
    setTimeout(() => { copied.value[key] = false }, 1500)
  })
}

function getModelValue(key) {
  if (key === 'bin') return props.binValue
  if (key === 'oct') return props.octValue
  if (key === 'dec') return props.decDisplay
  if (key === 'hex') return props.hexValue
  return ''
}
</script>

<template>
  <div class="radix-panel">
    <div class="bit-width-row">
      <span class="setting-label">{{ t('radixConverter.bitWidth') }}</span>
      <div class="width-btns">
        <button
          v-for="w in widths"
          :key="w"
          :class="['width-btn', { active: bitWidth === w }]"
          @click="$emit('update:bitWidth', w)"
        >{{ w }}</button>
      </div>
    </div>
    <div class="radix-rows">
      <div v-for="row in rows" :key="row.key" :class="['radix-row', { error: inputErrors[row.key] }]">
        <span class="row-label">{{ t('radixConverter.' + row.labelKey) }}</span>
        <input
          :value="getModelValue(row.key)"
          @input="$emit('update:' + row.key, $event.target.value)"
          class="radix-input"
          spellcheck="false"
        />
        <button class="btn-copy" @click="copyValue(row.key, getModelValue(row.key))">
          {{ copied[row.key] ? t('radixConverter.copied') : t('radixConverter.copy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radix-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bit-width-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.setting-label {
  font-size: 12px;
  color: #888;
}
.width-btns {
  display: flex;
  gap: 2px;
}
.width-btn {
  padding: 3px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.width-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.radix-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.radix-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.radix-row.error .radix-input {
  border-color: #e74c3c;
}
.row-label {
  min-width: 56px;
  font-size: 12px;
  font-weight: 600;
  color: #4a90d9;
  font-family: 'Consolas', 'Monaco', monospace;
}
.radix-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  outline: none;
}
.radix-input:focus {
  border-color: #4a90d9;
}
.btn-copy {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
}
.btn-copy:hover {
  background: #f0f0f0;
}
</style>
