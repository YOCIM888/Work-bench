<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  ipInfo: { type: Object, default: null }
})

const fields = [
  { key: 'ip', labelKey: 'ip' },
  { key: 'country', labelKey: 'country' },
  { key: 'region', labelKey: 'region' },
  { key: 'city', labelKey: 'city' },
  { key: 'isp', labelKey: 'isp' },
  { key: 'org', labelKey: 'org' },
  { key: 'timezone', labelKey: 'timezone' },
  { key: 'lat', labelKey: 'lat' },
  { key: 'lon', labelKey: 'lon' }
]
</script>

<template>
  <div class="ip-info" v-if="ipInfo">
    <div class="info-grid">
      <div v-for="field in fields" :key="field.key" class="info-item">
        <span class="info-label">{{ t('domainLookup.' + field.labelKey) }}</span>
        <span class="info-value">{{ ipInfo[field.key] ?? '-' }}</span>
      </div>
    </div>
  </div>
  <div class="no-data" v-else>{{ t('domainLookup.noData') }}</div>
</template>

<style scoped>
.ip-info {
  padding: 4px 0;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: #f9f9f9;
  border-radius: 4px;
}
.info-label {
  font-size: 11px;
  color: #888;
}
.info-value {
  font-size: 13px;
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
