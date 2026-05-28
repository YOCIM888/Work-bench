<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  savedColors: { type: Array, default: () => [] },
  currentHex: { type: String, default: '#FF0000' }
})

const emit = defineEmits(['save', 'remove', 'apply', 'random'])
</script>

<template>
  <div class="color-swatches">
    <div class="swatches-header">
      <span class="swatches-title">{{ t('colorPicker.savedColors') }}</span>
      <div class="swatches-actions">
        <button class="btn-action" @click="$emit('random')">{{ t('colorPicker.random') }}</button>
        <button class="btn-action btn-save" @click="$emit('save')">{{ t('colorPicker.save') }}</button>
      </div>
    </div>
    <div class="swatches-grid" v-if="savedColors.length > 0">
      <div
        class="swatch"
        v-for="color in savedColors"
        :key="color"
        :style="{ background: color }"
        :class="{ active: color === currentHex }"
        @click="$emit('apply', color)"
        @contextmenu.prevent="$emit('remove', color)"
        :title="color + ' — ' + t('colorPicker.remove')"
      ></div>
    </div>
    <div class="swatches-empty" v-else>
      {{ t('colorPicker.noSaved') }}
    </div>
  </div>
</template>

<style scoped>
.color-swatches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.swatches-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.swatches-title {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.swatches-actions {
  display: flex;
  gap: 6px;
}
.btn-action {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-action:hover {
  background: #f0f0f0;
}
.btn-save {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
.btn-save:hover {
  background: #3a7bc8;
}
.swatches-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s, transform 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.swatch:hover {
  transform: scale(1.1);
}
.swatch.active {
  border-color: #333;
}
.swatches-empty {
  font-size: 12px;
  color: #bbb;
  padding: 8px 0;
}
</style>
