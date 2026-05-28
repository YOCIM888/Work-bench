import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useTimestamp() {
  const timestampInput = ref('')
  const dateTimeInput = ref('')
  const selectedTimezone = ref('local')
  const currentTimestamp = ref(Math.floor(Date.now() / 1000))
  const currentDateTime = ref(new Date())
  let timer = null

  onMounted(() => {
    timer = setInterval(() => {
      currentTimestamp.value = Math.floor(Date.now() / 1000)
      currentDateTime.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  const isSeconds = computed(() => {
    const val = Number(timestampInput.value)
    if (isNaN(val)) return true
    return Math.abs(val) < 1e12
  })

  const convertedDate = computed(() => {
    const val = Number(timestampInput.value)
    if (isNaN(val) || !timestampInput.value) return null
    const ms = isSeconds.value ? val * 1000 : val
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  })

  const convertedTimestamp = computed(() => {
    if (!dateTimeInput.value) return null
    const d = new Date(dateTimeInput.value)
    if (isNaN(d.getTime())) return null
    return Math.floor(d.getTime() / 1000)
  })

  function formatDateLocal(d) {
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  function formatDateUTC(d) {
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  }

  function relativeTime(d) {
    const now = Date.now()
    const diff = d.getTime() - now
    const absDiff = Math.abs(diff)
    const seconds = Math.floor(absDiff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const isPast = diff < 0

    if (seconds < 10) return { key: 'justNow', args: {} }
    if (seconds < 60) return { key: isPast ? 'secondsAgo' : 'inSeconds', args: { count: seconds } }
    if (minutes < 60) return { key: isPast ? 'minutesAgo' : 'inMinutes', args: { count: minutes } }
    if (hours < 24) return { key: isPast ? 'hoursAgo' : 'inHours', args: { count: hours } }
    return { key: isPast ? 'daysAgo' : 'inDays', args: { count: days } }
  }

  function getFormats(d) {
    if (!d) return []
    const rel = relativeTime(d)
    return [
      { label: 'unixSeconds', value: String(Math.floor(d.getTime() / 1000)) },
      { label: 'unixMillis', value: String(d.getTime()) },
      { label: 'iso8601', value: d.toISOString() },
      { label: 'localTime', value: formatDateLocal(d) },
      { label: 'utcTime', value: formatDateUTC(d) },
      { label: 'relativeTime', value: rel }
    ]
  }

  function useCurrentTime() {
    timestampInput.value = String(Math.floor(Date.now() / 1000))
  }

  function useCurrentDateTime() {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    dateTimeInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  }

  return {
    timestampInput, dateTimeInput, selectedTimezone,
    currentTimestamp, currentDateTime,
    isSeconds, convertedDate, convertedTimestamp,
    getFormats, relativeTime,
    useCurrentTime, useCurrentDateTime,
    formatDateLocal
  }
}
