<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import LookupInput from './components/LookupInput.vue'
import IpInfo from './components/IpInfo.vue'
import DnsRecords from './components/DnsRecords.vue'
import HttpHeaders from './components/HttpHeaders.vue'
import { useDomainLookup } from './composables/useDomainLookup.js'

const { t } = useI18n()

const {
  query, loading, error,
  ipInfo, dnsRecords, httpHeaders,
  DNS_TYPES,
  lookupAll, lookupDns
} = useDomainLookup()

const activeTab = ref('ipInfo')

const tabs = [
  { id: 'ipInfo', key: 'ipInfo' },
  { id: 'dnsRecords', key: 'dnsRecords' },
  { id: 'httpHeaders', key: 'httpHeaders' }
]
</script>

<template>
  <div class="domain-lookup-app">
    <LookupInput
      :query="query"
      :loading="loading"
      @update:query="query = $event"
      @lookup="lookupAll"
    />

    <div class="error-msg" v-if="error">{{ t('domainLookup.' + error) }}</div>

    <template v-if="ipInfo || dnsRecords.length > 0 || httpHeaders">
      <div class="result-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >{{ t('domainLookup.' + tab.key) }}</button>
      </div>

      <div class="tab-content">
        <IpInfo v-if="activeTab === 'ipInfo'" :ip-info="ipInfo" />
        <DnsRecords
          v-else-if="activeTab === 'dnsRecords'"
          :records="dnsRecords"
          :dns-types="DNS_TYPES"
          @query-type="lookupDns"
        />
        <HttpHeaders v-else :http-headers="httpHeaders" />
      </div>
    </template>

    <div class="empty-state" v-else-if="!loading">
      {{ t('domainLookup.enterQuery') }}
    </div>
  </div>
</template>

<style scoped>
.domain-lookup-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 14px;
  overflow-y: auto;
}
.error-msg {
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.result-tabs {
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
.tab-content {
  flex: 1;
  min-height: 0;
}
.empty-state {
  text-align: center;
  padding: 32px;
  color: #aaa;
  font-size: 14px;
}
</style>
