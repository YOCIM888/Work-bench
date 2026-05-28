import { ref, reactive, computed } from 'vue'
import { parser } from 'cron-parser'

const FIELDS = ['second', 'minute', 'hour', 'day', 'month', 'weekday']

const FIELD_RANGES = {
  second: { min: 0, max: 59 },
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  weekday: { min: 0, max: 6 }
}

export function useCron() {
  const fields = reactive({
    second: { mode: 'every', value: '0', from: '0', to: '59', step: '1' },
    minute: { mode: 'every', value: '*', from: '0', to: '59', step: '1' },
    hour: { mode: 'every', value: '*', from: '0', to: '23', step: '1' },
    day: { mode: 'every', value: '*', from: '1', to: '31', step: '1' },
    month: { mode: 'every', value: '*', from: '1', to: '12', step: '1' },
    weekday: { mode: 'every', value: '*', from: '0', to: '6', step: '1' }
  })

  const manualExpression = ref('')

  function fieldToCron(field) {
    const f = fields[field]
    if (f.mode === 'every') return '*'
    if (f.mode === 'specific') return f.value
    if (f.mode === 'range') return `${f.from}-${f.to}`
    if (f.mode === 'step') return `*/${f.step}`
    return '*'
  }

  const expression = computed(() => {
    return FIELDS.map(f => fieldToCron(f)).join(' ')
  })

  const error = computed(() => {
    try {
      parser.parseExpression(expression.value)
      return false
    } catch {
      return true
    }
  })

  const nextExecutions = computed(() => {
    try {
      const interval = parser.parseExpression(expression.value)
      const results = []
      for (let i = 0; i < 5; i++) {
        const next = interval.next()
        results.push(next.toDate())
      }
      return results
    } catch {
      return []
    }
  })

  function applyPreset(preset) {
    const parts = preset.split(' ')
    FIELDS.forEach((field, i) => {
      const part = parts[i] || '*'
      if (part === '*') {
        fields[field].mode = 'every'
      } else if (part.includes('-') && !part.includes('/')) {
        fields[field].mode = 'range'
        const [from, to] = part.split('-')
        fields[field].from = from
        fields[field].to = to
      } else if (part.includes('/')) {
        fields[field].mode = 'step'
        const [base, step] = part.split('/')
        if (base === '*') {
          fields[field].from = String(FIELD_RANGES[field].min)
          fields[field].to = String(FIELD_RANGES[field].max)
        } else if (base.includes('-')) {
          const [from, to] = base.split('-')
          fields[field].from = from
          fields[field].to = to
        }
        fields[field].step = step
      } else {
        fields[field].mode = 'specific'
        fields[field].value = part
      }
    })
  }

  function parseManualExpression(expr) {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 6) return
    applyPreset(expr)
  }

  const PRESETS = [
    { key: 'everyMinute', expr: '0 * * * * *' },
    { key: 'every5Minutes', expr: '0 */5 * * * *' },
    { key: 'everyHour', expr: '0 0 * * * *' },
    { key: 'everyDay', expr: '0 0 0 * * *' },
    { key: 'everyWeek', expr: '0 0 0 * * 0' },
    { key: 'everyMonth', expr: '0 0 0 1 * *' },
    { key: 'everyYear', expr: '0 0 0 1 1 *' },
    { key: 'weekdays', expr: '0 0 0 * * 1-5' }
  ]

  return {
    fields, FIELDS, FIELD_RANGES,
    expression, error, nextExecutions,
    applyPreset, parseManualExpression, PRESETS,
    manualExpression
  }
}
