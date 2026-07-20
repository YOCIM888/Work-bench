<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  openWindows: {
    type: Array,
    default: () => []
  },
  activeWindowId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['restore', 'focus', 'minimize'])

function handleTaskClick(win) {
  if (win.minimized) {
    // 最小化的窗口 → 恢复
    emit('restore', win.id)
  } else if (win.id === props.activeWindowId) {
    // 当前活动窗口 → 最小化
    emit('minimize', win.id)
  } else {
    // 其他窗口 → 聚焦
    emit('focus', win.id)
  }
}
</script>

<template>
  <footer class="app-footer">
    <div class="taskbar">
      <button
        v-for="win in openWindows"
        :key="win.id"
        :class="{
          'task-btn': true,
          'active': win.id === activeWindowId && !win.minimized,
          'minimized': win.minimized
        }"
        @click="handleTaskClick(win)"
      >
        <span class="task-icon">
          <img :src="win.icon" alt="" />
        </span>
        <span class="task-label">{{ t(win.titleKey) }}</span>
      </button>
      <span v-if="openWindows.length === 0" class="taskbar-empty"></span>
    </div>
    <span class="copyright">{{ t('footer.copyright') }}</span>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  height: var(--taskbar-height);
  flex-shrink: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
}
.taskbar {
  display: flex;
  gap: 2px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  align-items: center;
}
.taskbar-empty {
  flex: 1;
}
.task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  transition: background 0.15s;
  flex-shrink: 0;
}
.task-btn:hover {
  background: var(--bg-hover);
}
.task-btn.active {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--accent-color);
}
.task-btn.minimized {
  opacity: 0.6;
}
.task-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.task-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copyright {
  font-size: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
  padding-left: 12px;
  white-space: nowrap;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .app-footer {
    padding: 0 4px;
  }
  .task-btn {
    max-width: 120px;
    padding: 4px 8px;
    font-size: 11px;
    height: 30px;
  }
  .task-icon {
    width: 16px;
    height: 16px;
  }
  .copyright {
    display: none;
  }
}
</style>
