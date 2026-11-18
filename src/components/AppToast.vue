<script setup>
import { toastState } from '../utils/clipboard'
</script>

<template>
  <Transition name="toast">
    <div v-if="toastState.visible" class="toast">
      <span class="icon">{{ toastState.icon }}</span>
      <span class="msg">{{ toastState.message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: calc(var(--taskbar-height) + 20px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--success-color);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
