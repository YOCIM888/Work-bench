import { ref, provide, inject, computed } from 'vue'
import en from './locales/en.js'
import zh from './locales/zh.js'
import ja from './locales/ja.js'

const I18N_KEY = Symbol('i18n')

const messages = { en, zh, ja }

const localeLabels = {
  en: 'EN',
  zh: '中文',
  ja: '日本語'
}

const STORAGE_KEY = 'yocim-bench-locale'

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && messages[saved]) return saved
  } catch {}
  return 'en'
}

export function createI18n() {
  const locale = ref(getInitialLocale())

  function t(key, params) {
    const keys = key.split('.')
    let value = messages[locale.value]
    for (const k of keys) {
      if (value == null) return key
      value = value[k]
    }
    if (typeof value !== 'string') return key
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, name) => params[name] != null ? params[name] : _)
    }
    return value
  }

  function setLocale(newLocale) {
    if (messages[newLocale]) {
      locale.value = newLocale
      try {
        localStorage.setItem(STORAGE_KEY, newLocale)
      } catch {}
    }
  }

  const i18n = {
    locale,
    t,
    setLocale,
    localeLabels,
    availableLocales: Object.keys(messages)
  }

  provide(I18N_KEY, i18n)
  return i18n
}

export function useI18n() {
  const i18n = inject(I18N_KEY)
  if (!i18n) throw new Error('i18n not provided')
  return i18n
}
