<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  httpHeaders: { type: Object, default: null }
})
</script>

<template>
  <div class="http-headers" v-if="httpHeaders">
    <div class="status-row">
      <span class="status-label">{{ t('domainLookup.statusCode') }}</span>
      <span :class="['status-code', httpHeaders.status < 400 ? 'success' : 'error']">
        {{ httpHeaders.status }} {{ httpHeaders.statusText }}
      </span>
    </div>
    <div class="cors-warning">{{ t('domainLookup.corsWarning') }}</div>
    <div class="headers-list">
      <div v-for="(value, key) in httpHeaders.headers" :key="key" class="header-row">
        <span class="header-key">{{ key }}</span>
        <span class="header-value">{{ value }}</span>
      </div>
    </div>
  </div>
  <div class="no-data" v-else>{{ t('domainLookup.noData') }}</div>
</template>

<style scoped>
.http-headers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-label {
  font-size: 12px;
  color: #888;
}
.status-code {
  font-size: 14px;
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', monospace;
}
.status-code.success {
  color: #27ae60;
}
.status-code.error {
  color: #e74c3c;
}
.cors-warning {
  font-size: 11px;
  color: #e67e22;
  background: #fef9e7;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #f9e79f;
}
.headers-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.header-row {
  display: flex;
  gap: 8px;
  padding: 4px 8px;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 12px;
}
.header-key {
  min-width: 140px;
  color: #9b59b6;
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 500;
}
.header-value {
  flex: 1;
  color: #333;
  word-break: break-all;
}
.no-data {
  text-align: center;
  padding: 16px;
  color: #aaa;
  font-size: 13px;
}
</style>
