<script setup>
import { ref, inject } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { locale, setLocale, localeLabels, availableLocales } = useI18n()
const theme = inject('theme')
const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectLocale(loc) {
  setLocale(loc)
  showDropdown.value = false
}

function handleClickOutside(e) {
  if (!e.target.closest('.lang-switcher')) {
    showDropdown.value = false
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img src="/icon/YOCIM.png" class="logo-icon" />
      <span class="logo-text">YOCIM BENCH</span>
    </div>
    <div class="header-right">
      <button class="theme-toggle" @click="theme.toggleTheme()" :title="theme.isDark ? 'Light mode' : 'Dark mode'">
        {{ theme.isDark ? '🌙' : '☀️' }}
      </button>
      <div class="lang-switcher" @click.stop="toggleDropdown">
        <span class="lang-label">{{ localeLabels[locale] }}</span>
        <span class="lang-arrow">▾</span>
        <div class="lang-dropdown" v-if="showDropdown">
          <button
            v-for="loc in availableLocales"
            :key="loc"
            :class="{ active: loc === locale }"
            @click.stop="selectLocale(loc)"
          >
            {{ localeLabels[loc] }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 1px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.theme-toggle {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--btn-bg);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.theme-toggle:hover {
  background: var(--btn-hover);
}
.lang-switcher {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
  background: var(--btn-bg);
}
.lang-switcher:hover {
  background: var(--btn-hover);
}
.lang-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}
.lang-arrow {
  font-size: 10px;
  color: var(--text-muted);
}
.lang-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px var(--shadow-color);
  overflow: hidden;
  z-index: 1000;
  min-width: 120px;
}
.lang-dropdown button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.lang-dropdown button:hover {
  background: var(--accent-hover);
}
.lang-dropdown button.active {
  background: var(--accent-bg);
  font-weight: 500;
}
</style>
