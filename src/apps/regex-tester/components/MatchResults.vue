<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  matches: { type: Array, default: () => [] },
  matchCount: { type: Number, default: 0 }
})
</script>

<template>
  <div class="match-results">
    <div class="results-header">
      <span class="results-title">{{ t('regexTester.matchResults') }}</span>
      <span class="results-count" v-if="matchCount > 0">{{ t('regexTester.matchCount', { count: matchCount }) }}</span>
    </div>
    <div class="no-match" v-if="matches.length === 0">
      {{ t('regexTester.noMatch') }}
    </div>
    <div class="match-list" v-else>
      <div class="match-item" v-for="(m, i) in matches" :key="i">
        <div class="match-header">
          <span class="match-index">{{ t('regexTester.match') }} #{{ i + 1 }}</span>
          <span class="match-pos">{{ t('regexTester.index') }}: {{ m.index }}</span>
        </div>
        <div class="match-text">{{ m.text }}</div>
        <div class="match-groups" v-if="m.groups.length > 0 || m.namedGroups">
          <span class="groups-label">{{ t('regexTester.groups') }}:</span>
          <span class="group-item" v-for="(g, gi) in m.groups" :key="gi">${{ gi + 1 }} = "{{ g }}"</span>
          <template v-if="m.namedGroups">
            <span class="group-item" v-for="(val, key) in m.namedGroups" :key="key">{{ key }} = "{{ val }}"</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.match-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.results-title {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.results-count {
  font-size: 12px;
  color: #4a90d9;
  font-weight: 500;
}
.no-match {
  font-size: 13px;
  color: #bbb;
  padding: 12px;
  text-align: center;
}
.match-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}
.match-item {
  padding: 8px 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fafafa;
}
.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.match-index {
  font-size: 12px;
  font-weight: 500;
  color: #4a90d9;
}
.match-pos {
  font-size: 11px;
  color: #aaa;
}
.match-text {
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  background: #ffeaa7;
  padding: 2px 6px;
  border-radius: 3px;
  display: inline-block;
  margin-bottom: 4px;
}
.match-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.groups-label {
  font-size: 11px;
  color: #888;
}
.group-item {
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #666;
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
}
</style>
