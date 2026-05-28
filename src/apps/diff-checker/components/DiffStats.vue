<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  stats: { type: Object, default: () => ({ added: 0, removed: 0 }) }
})
</script>

<template>
  <div class="diff-stats" v-if="stats.added > 0 || stats.removed > 0">
    <span class="stat-badge added">{{ t('diffChecker.addedLines', { count: stats.added }) }}</span>
    <span class="stat-badge removed">{{ t('diffChecker.removedLines', { count: stats.removed }) }}</span>
  </div>
</template>

<style scoped>
.diff-stats {
  display: flex;
  gap: 12px;
  padding: 6px 12px;
  border-top: 1px solid #e5e5e5;
}
.stat-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}
.stat-badge.added {
  background: #e6ffec;
  color: #22863a;
}
.stat-badge.removed {
  background: #ffebe9;
  color: #cb2431;
}
</style>
