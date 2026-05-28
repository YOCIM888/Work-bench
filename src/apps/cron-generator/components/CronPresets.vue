<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  presets: { type: Array, required: true }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="cron-presets">
    <span class="presets-label">{{ t('cronGenerator.presets') }}</span>
    <div class="presets-grid">
      <button
        v-for="preset in presets"
        :key="preset.key"
        class="preset-btn"
        @click="$emit('select', preset.expr)"
      >{{ t('cronGenerator.' + preset.key) }}</button>
    </div>
  </div>
</template>

<style scoped>
.cron-presets {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.presets-label {
  font-size: 12px;
  color: #888;
  padding-top: 5px;
}
.presets-grid {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.preset-btn {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.preset-btn:hover {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
</style>
