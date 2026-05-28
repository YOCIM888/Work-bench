<script setup>
import RegexInput from './components/RegexInput.vue'
import TestText from './components/TestText.vue'
import MatchResults from './components/MatchResults.vue'
import { useRegex } from './composables/useRegex.js'

const {
  pattern, flags, testString,
  flagOptions, presets,
  toggleFlag, applyPreset,
  regexError, matches,
  highlightedParts, matchCount
} = useRegex()
</script>

<template>
  <div class="regex-tester-app">
    <RegexInput
      :pattern="pattern"
      :flags="flags"
      :flag-options="flagOptions"
      :presets="presets"
      :error="regexError"
      @update:pattern="pattern = $event"
      @toggle-flag="toggleFlag"
      @apply-preset="applyPreset"
    />
    <TestText
      :test-string="testString"
      :highlighted-parts="highlightedParts"
      @update:test-string="testString = $event"
      class="test-section"
    />
    <MatchResults
      :matches="matches"
      :match-count="matchCount"
    />
  </div>
</template>

<style scoped>
.regex-tester-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 16px;
  overflow-y: auto;
}
.test-section {
  flex: 1;
  min-height: 0;
}
</style>
