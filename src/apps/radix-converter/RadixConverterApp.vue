<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import RadixPanel from './components/RadixPanel.vue'
import CharPanel from './components/CharPanel.vue'
import { useRadixConverter } from './composables/useRadixConverter.js'

const { t } = useI18n()

const {
  decValue, bitWidth, inputErrors,
  binValue, octValue, decDisplay, hexValue,
  updateFromBin, updateFromOct, updateFromDec, updateFromHex,
  charInput, charResults,
  codePointInput, decodedChar, codePointError
} = useRadixConverter()

const activeTab = ref('radix')

const tabs = [
  { id: 'radix', key: 'radixConvert' },
  { id: 'char', key: 'charConvert' }
]
</script>

<template>
  <div class="radix-converter-app">
    <div class="app-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >{{ t('radixConverter.' + tab.key) }}</button>
    </div>

    <RadixPanel
      v-if="activeTab === 'radix'"
      :bin-value="binValue"
      :oct-value="octValue"
      :dec-display="decDisplay"
      :hex-value="hexValue"
      :bit-width="bitWidth"
      :input-errors="inputErrors"
      @update:bin="updateFromBin"
      @update:oct="updateFromOct"
      @update:dec="updateFromDec"
      @update:hex="updateFromHex"
      @update:bit-width="bitWidth = $event"
    />

    <CharPanel
      v-else
      :char-input="charInput"
      :char-results="charResults"
      :code-point-input="codePointInput"
      :decoded-char="decodedChar"
      :code-point-error="codePointError"
      @update:char-input="charInput = $event"
      @update:code-point-input="codePointInput = $event"
    />
  </div>
</template>

<style scoped>
.radix-converter-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 14px;
  overflow-y: auto;
}
.app-tabs {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}
.tab-btn {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: #4a90d9;
  color: #fff;
}
</style>
