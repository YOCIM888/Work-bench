<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useUrlCodec } from '../composables/useUrlCodec.js'

const { t } = useI18n()

const {
  urlInput, urlParsed, urlError, sortedParams
} = useUrlCodec()

const sortAlphabetically = ref(false)
const copiedIdx = ref(-1)

const displayParams = computed(() => {
  return sortAlphabetically.value ? sortedParams.value : (urlParsed.value?.params || [])
})

function copyValue(val, idx) {
  navigator.clipboard.writeText(val).then(() => {
    copiedIdx.value = idx
    setTimeout(() => { copiedIdx.value = -1 }, 1500)
  })
}

function copyField(val) {
  navigator.clipboard.writeText(val)
}

const urlFields = computed(() => {
  if (!urlParsed.value) return []
  return [
    { label: t('urlCodec.protocol'), value: urlParsed.value.protocol },
    { label: t('urlCodec.hostname'), value: urlParsed.value.hostname },
    { label: t('urlCodec.port'), value: urlParsed.value.port },
    { label: t('urlCodec.pathname'), value: urlParsed.value.pathname },
    { label: t('urlCodec.search'), value: urlParsed.value.search },
    { label: t('urlCodec.hash'), value: urlParsed.value.hash }
  ]
})
</script>

<template>
  <div class="url-parser">
    <div class="url-input-row">
      <input
        v-model="urlInput"
        type="text"
        class="url-input"
        :placeholder="t('urlCodec.urlInput')"
        spellcheck="false"
      />
    </div>
    <div class="error-msg" v-if="urlError">{{ t('urlCodec.parseError') }}</div>
    <template v-if="urlParsed && !urlError">
      <div class="parsed-fields">
        <div
          v-for="field in urlFields"
          :key="field.label"
          class="field-row"
        >
          <span class="field-label">{{ field.label }}</span>
          <span class="field-value">{{ field.value }}</span>
          <button
            class="btn-copy-field"
            v-if="field.value !== '-'"
            @click="copyField(field.value)"
          >{{ t('urlCodec.copy') }}</button>
        </div>
      </div>
      <div class="params-section">
        <div class="params-header">
          <span>{{ t('urlCodec.queryParams') }}</span>
          <span class="param-count">{{ t('urlCodec.paramCount', { count: displayParams.length }) }}</span>
          <button
            class="btn-sort"
            :class="{ active: sortAlphabetically }"
            @click="sortAlphabetically = !sortAlphabetically"
          >{{ t('urlCodec.sort') }}</button>
        </div>
        <div class="params-table" v-if="displayParams.length > 0">
          <div class="param-row param-header-row">
            <span class="param-key">{{ t('urlCodec.key') }}</span>
            <span class="param-val">{{ t('urlCodec.value') }}</span>
            <span class="param-action"></span>
          </div>
          <div
            v-for="(param, idx) in displayParams"
            :key="idx"
            class="param-row"
          >
            <span class="param-key">{{ param.key }}</span>
            <span class="param-val">{{ param.value }}</span>
            <button class="btn-copy-param" @click="copyValue(param.value, idx)">
              {{ copiedIdx === idx ? t('urlCodec.copied') : t('urlCodec.copyValue') }}
            </button>
          </div>
        </div>
        <div class="no-params" v-else>{{ t('urlCodec.noParams') }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.url-parser {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
}
.url-input-row {
  display: flex;
  gap: 8px;
}
.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  outline: none;
}
.url-input:focus {
  border-color: #4a90d9;
}
.url-input::placeholder {
  color: #bbb;
}
.error-msg {
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.parsed-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f9f9f9;
  border-radius: 4px;
}
.field-label {
  font-size: 12px;
  color: #888;
  min-width: 80px;
}
.field-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  word-break: break-all;
}
.btn-copy-field {
  padding: 2px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-copy-field:hover {
  background: #f0f0f0;
}
.params-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.params-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}
.param-count {
  font-size: 11px;
  color: #aaa;
}
.btn-sort {
  margin-left: auto;
  padding: 3px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-sort.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.params-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 4px;
}
.param-header-row {
  background: #f0f0f0;
  font-size: 12px;
  color: #888;
  font-weight: 500;
}
.param-row:not(.param-header-row) {
  background: #fafafa;
}
.param-key {
  min-width: 120px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #9b59b6;
  word-break: break-all;
}
.param-val {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  word-break: break-all;
}
.param-action {
  width: 70px;
}
.btn-copy-param {
  padding: 2px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-copy-param:hover {
  background: #f0f0f0;
}
.no-params {
  padding: 12px;
  text-align: center;
  color: #aaa;
  font-size: 13px;
}
</style>
