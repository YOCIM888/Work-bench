<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  pattern: { type: String, default: '' },
  flags: { type: String, default: 'g' },
  flagOptions: { type: Array, default: () => [] },
  presets: { type: Array, default: () => [] },
  error: { type: String, default: null }
})

const emit = defineEmits(['update:pattern', 'update:flags', 'toggle-flag', 'apply-preset'])

const copied = ref(false)

function copyRegex() {
  const text = '/' + props.pattern + '/' + props.flags
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}
</script>

<template>
  <div class="regex-input">
    <div class="pattern-row">
      <span class="pattern-slash">/</span>
      <input
        class="pattern-field"
        :value="pattern"
        @input="$emit('update:pattern', $event.target.value)"
        :placeholder="t('regexTester.pattern')"
        spellcheck="false"
      />
      <span class="pattern-slash">/</span>
      <span class="flags-display">{{ flags }}</span>
    </div>
    <div class="error-msg" v-if="error">{{ t('regexTester.error') }}: {{ error }}</div>
    <div class="flags-row">
      <label class="flag-checkbox" v-for="flag in flagOptions" :key="flag.key">
        <input
          type="checkbox"
          :checked="flags.includes(flag.key)"
          @change="$emit('toggle-flag', flag.key)"
        />
        <span>{{ t('regexTester.' + flag.label) }}</span>
      </label>
    </div>
    <div class="actions-row">
      <div class="presets">
        <span class="presets-label">{{ t('regexTester.presets') }}:</span>
        <button
          class="btn-preset"
          v-for="preset in presets"
          :key="preset.key"
          @click="$emit('apply-preset', preset)"
        >
          {{ t('regexTester.' + preset.key) }}
        </button>
      </div>
      <button class="btn-copy" @click="copyRegex">{{ copied ? t('regexTester.copied') : t('regexTester.copy') }}</button>
    </div>
  </div>
</template>

<style scoped>
.regex-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pattern-row {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
}
.pattern-row:focus-within {
  border-color: #4a90d9;
}
.pattern-slash {
  padding: 0 8px;
  color: #999;
  font-size: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  flex-shrink: 0;
}
.pattern-field {
  flex: 1;
  border: none;
  padding: 8px 4px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  outline: none;
  min-width: 0;
}
.pattern-field::placeholder {
  color: #ccc;
}
.flags-display {
  padding: 0 10px;
  color: #4a90d9;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 500;
  flex-shrink: 0;
}
.error-msg {
  font-size: 12px;
  color: #e74c3c;
  padding: 2px 4px;
}
.flags-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.flag-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #555;
}
.flag-checkbox input {
  cursor: pointer;
}
.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.presets {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.presets-label {
  font-size: 12px;
  color: #888;
}
.btn-preset {
  padding: 3px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f8f8;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-preset:hover {
  background: #e8e8e8;
}
.btn-copy {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.btn-copy:hover {
  background: #f0f0f0;
}
</style>
