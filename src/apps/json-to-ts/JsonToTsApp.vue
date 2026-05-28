<script setup>
import { useI18n } from '@/i18n/index.js'
import JsonInput from './components/JsonInput.vue'
import TsOutput from './components/TsOutput.vue'
import { useJsonToTs } from './composables/useJsonToTs.js'

const { t } = useI18n()

const {
  inputJson, rootName, exportAs, optionalFields, semicolons,
  outputTs, error, stats,
  loadSample, clearAll, downloadTs
} = useJsonToTs()
</script>

<template>
  <div class="json-to-ts-app">
    <div class="settings-bar">
      <div class="setting-item">
        <label class="setting-label">{{ t('jsonToTs.rootName') }}</label>
        <input v-model="rootName" type="text" class="setting-input" placeholder="RootObject" />
      </div>
      <div class="setting-item">
        <label class="setting-label">{{ t('jsonToTs.exportType') }}</label>
        <div class="toggle-group">
          <button
            :class="['toggle-btn', { active: exportAs === 'interface' }]"
            @click="exportAs = 'interface'"
          >{{ t('jsonToTs.interface') }}</button>
          <button
            :class="['toggle-btn', { active: exportAs === 'type' }]"
            @click="exportAs = 'type'"
          >{{ t('jsonToTs.typeAlias') }}</button>
        </div>
      </div>
      <label class="setting-checkbox" :title="t('jsonToTs.optionalHint')">
        <input type="checkbox" v-model="optionalFields" />
        {{ t('jsonToTs.optionalFields') }}
      </label>
      <label class="setting-checkbox" :title="t('jsonToTs.semicolonsHint')">
        <input type="checkbox" v-model="semicolons" />
        {{ t('jsonToTs.semicolons') }}
      </label>
    </div>
    <div class="main-panels">
      <JsonInput
        :input-json="inputJson"
        @update:input-json="inputJson = $event"
        @sample="loadSample"
        @clear="clearAll"
      />
      <TsOutput
        :output-ts="outputTs"
        :error="error"
        :stats="stats"
        @download="downloadTs"
      />
    </div>
  </div>
</template>

<style scoped>
.json-to-ts-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 12px;
}
.settings-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.setting-label {
  font-size: 12px;
  color: #555;
}
.setting-input {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  outline: none;
  width: 120px;
}
.setting-input:focus {
  border-color: #4a90d9;
}
.toggle-group {
  display: flex;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 2px;
}
.toggle-btn {
  padding: 3px 10px;
  border: none;
  border-radius: 3px;
  background: transparent;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.toggle-btn.active {
  background: #4a90d9;
  color: #fff;
}
.setting-checkbox {
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.setting-checkbox input {
  accent-color: #4a90d9;
}
.main-panels {
  flex: 1;
  display: flex;
  gap: 8px;
  min-height: 0;
}
</style>
