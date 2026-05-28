<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  openWindows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['restore'])
</script>

<template>
  <footer class="app-footer">
    <div class="taskbar">
      <button
        v-for="win in openWindows.filter(w => w.minimized)"
        :key="win.id"
        @click="emit('restore', win.id)"
      >
        {{ t(win.titleKey) }}
      </button>
    </div>
    <span class="copyright">{{ t('footer.copyright') }}</span>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  min-height: 36px;
}
.taskbar {
  display: flex;
  gap: 8px;
}
.taskbar button {
  padding: 4px 12px;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  background: var(--bg-tertiary);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
}
.taskbar button:hover {
  background: var(--btn-hover);
}
.copyright {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
