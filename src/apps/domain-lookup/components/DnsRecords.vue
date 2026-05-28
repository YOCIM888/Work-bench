<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  records: { type: Array, default: () => [] },
  dnsTypes: { type: Array, default: () => [] }
})

const emit = defineEmits(['queryType'])

const selectedType = ref('')

function queryType(type) {
  selectedType.value = type
  emit('queryType', type)
}

function queryAll() {
  selectedType.value = ''
  emit('queryType', '')
}
</script>

<template>
  <div class="dns-records">
    <div class="dns-controls">
      <div class="type-btns">
        <button
          :class="['type-btn', { active: selectedType === '' }]"
          @click="queryAll"
        >{{ t('domainLookup.queryAll') }}</button>
        <button
          v-for="dt in dnsTypes"
          :key="dt"
          :class="['type-btn', { active: selectedType === dt }]"
          @click="queryType(dt)"
        >{{ t('domainLookup.' + dt.toLowerCase()) }}</button>
      </div>
    </div>
    <div class="records-table" v-if="records.length > 0">
      <div class="record-row record-header">
        <span class="col-type">{{ t('domainLookup.recordType') }}</span>
        <span class="col-name">{{ t('domainLookup.name') }}</span>
        <span class="col-ttl">{{ t('domainLookup.ttl') }}</span>
        <span class="col-value">{{ t('domainLookup.value') }}</span>
      </div>
      <div v-for="(rec, idx) in records" :key="idx" class="record-row">
        <span class="col-type type-badge">{{ rec.type }}</span>
        <span class="col-name">{{ rec.name }}</span>
        <span class="col-ttl">{{ rec.ttl }}s</span>
        <span class="col-value">{{ rec.value }}</span>
      </div>
    </div>
    <div class="no-records" v-else>{{ t('domainLookup.notFound') }}</div>
  </div>
</template>

<style scoped>
.dns-records {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dns-controls {
  display: flex;
  gap: 8px;
}
.type-btns {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}
.type-btn {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.type-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.records-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.record-row {
  display: flex;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.record-header {
  background: #f0f0f0;
  color: #888;
  font-weight: 500;
}
.record-row:not(.record-header) {
  background: #fafafa;
}
.col-type {
  min-width: 50px;
}
.type-badge {
  color: #4a90d9;
  font-weight: 600;
}
.col-name {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #555;
  word-break: break-all;
}
.col-ttl {
  min-width: 50px;
  color: #888;
  text-align: right;
}
.col-value {
  flex: 2;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  word-break: break-all;
}
.no-records {
  text-align: center;
  padding: 16px;
  color: #aaa;
  font-size: 13px;
}
</style>
