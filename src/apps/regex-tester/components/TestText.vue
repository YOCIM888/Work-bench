<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  testString: { type: String, default: '' },
  highlightedParts: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:testString'])
</script>

<template>
  <div class="test-text">
    <label class="test-label">{{ t('regexTester.testString') }}</label>
    <textarea
      class="test-input"
      :value="testString"
      @input="$emit('update:testString', $event.target.value)"
      :placeholder="t('regexTester.testString')"
      spellcheck="false"
    ></textarea>
    <div class="highlighted-preview" v-if="highlightedParts.length > 0 && (highlightedParts.some(p => p.highlight) || testString)">
      <template v-for="(part, i) in highlightedParts" :key="i">
        <mark v-if="part.highlight" class="highlight-mark">{{ part.text }}</mark>
        <span v-else>{{ part.text }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.test-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.test-label {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.test-input {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  line-height: 1.6;
  color: #333;
  outline: none;
  resize: vertical;
  background: #fff;
}
.test-input:focus {
  border-color: #4a90d9;
}
.test-input::placeholder {
  color: #ccc;
}
.highlighted-preview {
  padding: 10px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #fafafa;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}
.highlight-mark {
  background: #ffeaa7;
  color: #333;
  border-radius: 2px;
  padding: 0 1px;
}
</style>
