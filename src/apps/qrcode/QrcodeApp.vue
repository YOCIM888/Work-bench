<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import QrcodeGenerator from './components/QrcodeGenerator.vue'
import QrcodeParser from './components/QrcodeParser.vue'

const { t } = useI18n()

const activeTab = ref('generate')

const tabs = [
  { id: 'generate', key: 'generate' },
  { id: 'parse', key: 'parse' }
]
</script>

<template>
  <div class="qrcode-app">
    <div class="app-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >{{ t('qrcode.' + tab.key) }}</button>
    </div>
    <div class="tab-content">
      <QrcodeGenerator v-if="activeTab === 'generate'" />
      <QrcodeParser v-else />
    </div>
  </div>
</template>

<style scoped>
.qrcode-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 12px;
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
.tab-content {
  flex: 1;
  min-height: 0;
}
</style>
