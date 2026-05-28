<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import UrlEncodeDecode from './components/UrlEncodeDecode.vue'
import UrlParser from './components/UrlParser.vue'

const { t } = useI18n()
const activeTab = ref('encode')
</script>

<template>
  <div class="url-codec-app">
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'encode' }]"
        @click="activeTab = 'encode'"
      >{{ t('urlCodec.encodeDecode') }}</button>
      <button
        :class="['tab-btn', { active: activeTab === 'parse' }]"
        @click="activeTab = 'parse'"
      >{{ t('urlCodec.urlParser') }}</button>
    </div>
    <div class="tab-content">
      <UrlEncodeDecode v-if="activeTab === 'encode'" />
      <UrlParser v-else />
    </div>
  </div>
</template>

<style scoped>
.url-codec-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 12px;
}
.tabs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.tab-btn:hover:not(.active) {
  background: #f0f0f0;
}
.tab-content {
  flex: 1;
  min-height: 0;
}
</style>
