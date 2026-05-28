<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  charInput: { type: String, default: '' },
  charResults: { type: Array, default: () => [] },
  codePointInput: { type: String, default: '' },
  decodedChar: { type: String, default: null },
  codePointError: { type: Boolean, default: false }
})

const emit = defineEmits(['update:charInput', 'update:codePointInput'])

const copied = ref({})

function copyText(key, value) {
  navigator.clipboard.writeText(String(value)).then(() => {
    copied.value[key] = true
    setTimeout(() => { copied.value[key] = false }, 1500)
  })
}
</script>

<template>
  <div class="char-panel">
    <div class="char-section">
      <div class="section-header">
        <span class="section-label">{{ t('radixConverter.charInput') }}</span>
      </div>
      <input
        :value="charInput"
        @input="$emit('update:charInput', $event.target.value)"
        class="char-input"
        :placeholder="t('radixConverter.charInputPlaceholder')"
      />
      <div class="char-table" v-if="charResults.length > 0">
        <div class="table-header">
          <span class="col-char">{{ t('radixConverter.char') }}</span>
          <span class="col-dec">{{ t('radixConverter.decimal') }}</span>
          <span class="col-hex">{{ t('radixConverter.hexadecimal') }}</span>
          <span class="col-unicode">{{ t('radixConverter.unicode') }}</span>
          <span class="col-html">{{ t('radixConverter.htmlEntity') }}</span>
        </div>
        <div v-for="(item, idx) in charResults" :key="idx" class="table-row">
          <span class="col-char char-display">{{ item.char }}</span>
          <span class="col-dec">
            {{ item.decimal }}
            <button class="btn-mini" @click="copyText('dec'+idx, item.decimal)">{{ copied['dec'+idx] ? '✓' : '📋' }}</button>
          </span>
          <span class="col-hex">
            0x{{ item.hex }}
            <button class="btn-mini" @click="copyText('hex'+idx, '0x'+item.hex)">{{ copied['hex'+idx] ? '✓' : '📋' }}</button>
          </span>
          <span class="col-unicode">
            {{ item.unicode }}
            <button class="btn-mini" @click="copyText('uni'+idx, item.unicode)">{{ copied['uni'+idx] ? '✓' : '📋' }}</button>
          </span>
          <span class="col-html">
            {{ item.htmlEntity }}
            <button class="btn-mini" @click="copyText('html'+idx, item.htmlEntity)">{{ copied['html'+idx] ? '✓' : '📋' }}</button>
          </span>
        </div>
      </div>
    </div>
    <div class="codepoint-section">
      <div class="section-header">
        <span class="section-label">{{ t('radixConverter.codePointInput') }}</span>
      </div>
      <div class="codepoint-row">
        <input
          :value="codePointInput"
          @input="$emit('update:codePointInput', $event.target.value)"
          class="codepoint-input"
          :placeholder="t('radixConverter.codePointPlaceholder')"
          :class="{ error: codePointError }"
        />
        <div class="decoded-result" v-if="decodedChar">
          <span class="section-label">{{ t('radixConverter.decodedChar') }}:</span>
          <span class="decoded-char">{{ decodedChar }}</span>
        </div>
        <div class="error-msg" v-else-if="codePointError">{{ t('radixConverter.invalidCodePoint') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.char-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.char-section, .codepoint-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.char-input, .codepoint-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
}
.char-input:focus, .codepoint-input:focus {
  border-color: #4a90d9;
}
.codepoint-input.error {
  border-color: #e74c3c;
}
.char-table {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}
.table-header {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  background: #f0f0f0;
  font-size: 11px;
  color: #888;
  font-weight: 500;
}
.table-row {
  display: flex;
  gap: 4px;
  padding: 5px 8px;
  font-size: 12px;
  border-top: 1px solid #f0f0f0;
  align-items: center;
}
.table-row:hover {
  background: #fafafa;
}
.col-char { min-width: 36px; text-align: center; }
.col-dec { flex: 1; font-family: 'Consolas', monospace; color: #555; }
.col-hex { flex: 1; font-family: 'Consolas', monospace; color: #9b59b6; }
.col-unicode { flex: 1.2; font-family: 'Consolas', monospace; color: #27ae60; }
.col-html { flex: 1; font-family: 'Consolas', monospace; color: #e67e22; }
.char-display {
  font-size: 16px;
  font-weight: 500;
}
.btn-mini {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 10px;
  padding: 0 2px;
  opacity: 0.5;
}
.btn-mini:hover {
  opacity: 1;
}
.codepoint-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.codepoint-input {
  width: 140px;
}
.decoded-result {
  display: flex;
  align-items: center;
  gap: 6px;
}
.decoded-char {
  font-size: 20px;
  font-weight: 500;
}
.error-msg {
  color: #e74c3c;
  font-size: 12px;
}
</style>
