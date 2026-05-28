<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t, locale } = useI18n()

const props = defineProps({
  expression: { type: String, required: true },
  error: { type: Boolean, default: false },
  nextExecutions: { type: Array, default: () => [] }
})

const copied = ref(false)

function copyExpr() {
  navigator.clipboard.writeText(props.expression).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  })
}

function formatDate(date) {
  return date.toLocaleString(locale.value === 'zh' ? 'zh-CN' : locale.value === 'ja' ? 'ja-JP' : 'en-US')
}

function getHumanReadable() {
  if (props.error) return t('cronGenerator.invalidExpression')
  const parts = props.expression.split(' ')
  if (parts.length !== 6) return t('cronGenerator.invalidExpression')

  const descriptions = []
  const fieldNames = ['second', 'minute', 'hour', 'day', 'month', 'weekday']

  for (let i = 0; i < 6; i++) {
    const part = parts[i]
    const fieldName = fieldNames[i]
    if (part === '*') continue

    if (part.startsWith('*/')) {
      const step = part.split('/')[1]
      descriptions.push(t('cronGenerator.humanEvery') + ' ' + step + ' ' + t('cronGenerator.human' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)))
    } else if (part.includes('-') && !part.includes('/')) {
      const [from, to] = part.split('-')
      descriptions.push(t('cronGenerator.human' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)) + ' ' + t('cronGenerator.humanFromTo', { from, to }))
    } else {
      descriptions.push(t('cronGenerator.humanAt') + ' ' + fieldName + ' ' + part)
    }
  }

  if (descriptions.length === 0) return t('cronGenerator.humanEverySecond')
  return descriptions.join(', ')
}
</script>

<template>
  <div class="cron-preview">
    <div class="expression-display">
      <div class="expr-header">
        <span>{{ t('cronGenerator.expression') }}</span>
        <button class="btn-copy" @click="copyExpr">{{ copied ? t('cronGenerator.copied') : t('cronGenerator.copy') }}</button>
      </div>
      <div class="expr-value" :class="{ error: error }">{{ expression }}</div>
    </div>
    <div class="human-readable" v-if="!error">
      <span class="section-label">{{ t('cronGenerator.humanReadable') }}</span>
      <p class="human-text">{{ getHumanReadable() }}</p>
    </div>
    <div class="next-executions" v-if="!error && nextExecutions.length > 0">
      <span class="section-label">{{ t('cronGenerator.nextExecutions') }}</span>
      <div class="execution-list">
        <div v-for="(date, idx) in nextExecutions" :key="idx" class="execution-item">
          <span class="exec-index">{{ idx + 1 }}.</span>
          <span class="exec-time">{{ formatDate(date) }}</span>
        </div>
      </div>
    </div>
    <div class="error-msg" v-if="error">{{ t('cronGenerator.invalidExpression') }}</div>
  </div>
</template>

<style scoped>
.cron-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.expression-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.expr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
}
.btn-copy {
  padding: 2px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-copy:hover {
  background: #f0f0f0;
}
.expr-value {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  letter-spacing: 2px;
}
.expr-value.error {
  color: #e74c3c;
  background: #fef5f5;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.human-text {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}
.execution-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.execution-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 13px;
}
.exec-index {
  color: #aaa;
  font-size: 12px;
  min-width: 20px;
}
.exec-time {
  font-family: 'Consolas', 'Monaco', monospace;
  color: #333;
  font-size: 13px;
}
.error-msg {
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
</style>
