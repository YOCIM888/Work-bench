<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  query: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:query', 'lookup'])
</script>

<template>
  <div class="lookup-input">
    <input
      :value="query"
      @input="$emit('update:query', $event.target.value)"
      @keyup.enter="$emit('lookup')"
      type="text"
      class="query-input"
      :placeholder="t('domainLookup.inputPlaceholder')"
      spellcheck="false"
      :disabled="loading"
    />
    <button
      class="btn-lookup"
      @click="$emit('lookup')"
      :disabled="loading || !query.trim()"
    >
      {{ loading ? t('domainLookup.loading') : t('domainLookup.lookup') }}
    </button>
  </div>
</template>

<style scoped>
.lookup-input {
  display: flex;
  gap: 8px;
}
.query-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  outline: none;
}
.query-input:focus {
  border-color: #4a90d9;
}
.query-input::placeholder {
  color: #bbb;
}
.btn-lookup {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
}
.btn-lookup:hover:not(:disabled) {
  opacity: 0.85;
}
.btn-lookup:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
