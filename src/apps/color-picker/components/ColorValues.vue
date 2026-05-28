<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  hex: { type: String, default: '#FF0000' },
  rgb: { type: Object, default: () => ({ r: 255, g: 0, b: 0 }) },
  hsl: { type: Object, default: () => ({ h: 0, s: 100, l: 50 }) },
  rgbString: { type: String, default: '' },
  hslString: { type: String, default: '' }
})

const emit = defineEmits(['set-hex', 'set-rgb', 'set-hsl'])

const copiedField = ref('')

function copyValue(value, field) {
  navigator.clipboard.writeText(value).then(() => {
    copiedField.value = field
    setTimeout(() => { copiedField.value = '' }, 1500)
  })
}

const hexInput = ref(props.hex)
const rInput = ref(props.rgb.r)
const gInput = ref(props.rgb.g)
const bInput = ref(props.rgb.b)
const hslHInput = ref(props.hsl.h)
const hslSInput = ref(props.hsl.s)
const hslLInput = ref(props.hsl.l)

function submitHex() {
  let val = hexInput.value.trim()
  if (!val.startsWith('#')) val = '#' + val
  emit('set-hex', val)
}

function submitRgb() {
  emit('set-rgb', parseInt(rInput.value) || 0, parseInt(gInput.value) || 0, parseInt(bInput.value) || 0)
}

function submitHsl() {
  emit('set-hsl', parseInt(hslHInput.value) || 0, parseInt(hslSInput.value) || 0, parseInt(hslLInput.value) || 0)
}

function syncInputs() {
  hexInput.value = props.hex
  rInput.value = props.rgb.r
  gInput.value = props.rgb.g
  bInput.value = props.rgb.b
  hslHInput.value = props.hsl.h
  hslSInput.value = props.hsl.s
  hslLInput.value = props.hsl.l
}

import { watch } from 'vue'
watch(() => [props.hex, props.rgb, props.hsl], syncInputs, { deep: true })
</script>

<template>
  <div class="color-values">
    <div class="color-preview" :style="{ background: hex }"></div>

    <div class="value-group">
      <label class="value-label">{{ t('colorPicker.hex') }}</label>
      <div class="value-row">
        <input class="value-input" v-model="hexInput" @keydown.enter="submitHex" @blur="submitHex" />
        <button class="btn-copy" @click="copyValue(hex, 'hex')">{{ copiedField === 'hex' ? t('colorPicker.copied') : t('colorPicker.copy') }}</button>
      </div>
    </div>

    <div class="value-group">
      <label class="value-label">{{ t('colorPicker.rgb') }}</label>
      <div class="value-row rgb-row">
        <div class="rgb-inputs">
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.red') }}</span>
            <input class="value-input small" type="number" min="0" max="255" v-model.number="rInput" @keydown.enter="submitRgb" @blur="submitRgb" />
          </div>
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.green') }}</span>
            <input class="value-input small" type="number" min="0" max="255" v-model.number="gInput" @keydown.enter="submitRgb" @blur="submitRgb" />
          </div>
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.blue') }}</span>
            <input class="value-input small" type="number" min="0" max="255" v-model.number="bInput" @keydown.enter="submitRgb" @blur="submitRgb" />
          </div>
        </div>
        <button class="btn-copy" @click="copyValue(rgbString, 'rgb')">{{ copiedField === 'rgb' ? t('colorPicker.copied') : t('colorPicker.copy') }}</button>
      </div>
    </div>

    <div class="value-group">
      <label class="value-label">{{ t('colorPicker.hsl') }}</label>
      <div class="value-row rgb-row">
        <div class="rgb-inputs">
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.hue') }}</span>
            <input class="value-input small" type="number" min="0" max="360" v-model.number="hslHInput" @keydown.enter="submitHsl" @blur="submitHsl" />
          </div>
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.saturation') }}</span>
            <input class="value-input small" type="number" min="0" max="100" v-model.number="hslSInput" @keydown.enter="submitHsl" @blur="submitHsl" />
          </div>
          <div class="rgb-field">
            <span class="rgb-label">{{ t('colorPicker.lightness') }}</span>
            <input class="value-input small" type="number" min="0" max="100" v-model.number="hslLInput" @keydown.enter="submitHsl" @blur="submitHsl" />
          </div>
        </div>
        <button class="btn-copy" @click="copyValue(hslString, 'hsl')">{{ copiedField === 'hsl' ? t('colorPicker.copied') : t('colorPicker.copy') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-values {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.color-preview {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
.value-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.value-label {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.value-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.rgb-row {
  flex-wrap: wrap;
}
.rgb-inputs {
  display: flex;
  gap: 4px;
  flex: 1;
}
.rgb-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 2px;
}
.rgb-label {
  font-size: 10px;
  color: #aaa;
}
.value-input {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  outline: none;
  background: #fff;
  min-width: 0;
}
.value-input:focus {
  border-color: #4a90d9;
}
.value-input.small {
  width: 100%;
  text-align: center;
  padding: 5px 4px;
}
.btn-copy {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  flex-shrink: 0;
}
.btn-copy:hover {
  background: #f0f0f0;
}
</style>
