import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const STORAGE_KEY = 'yocim-bench-pomodoro'

function loadSettings() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      workMinutes: data.workMinutes || 25,
      shortBreakMinutes: data.shortBreakMinutes || 5,
      longBreakMinutes: data.longBreakMinutes || 15,
      longBreakInterval: data.longBreakInterval || 4,
      autoStart: data.autoStart || false,
      sound: data.sound !== undefined ? data.sound : true,
      completedToday: data.completedToday || 0,
      lastDate: data.lastDate || ''
    }
  } catch {
    return {
      workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15,
      longBreakInterval: 4, autoStart: false, sound: true,
      completedToday: 0, lastDate: ''
    }
  }
}

export function usePomodoro() {
  const settings = ref(loadSettings())
  const phase = ref('work')
  const currentRound = ref(1)
  const isRunning = ref(false)
  const timeRemaining = ref(settings.value.workMinutes * 60)
  const showNotification = ref(null)

  let timer = null

  const totalSeconds = computed(() => {
    if (phase.value === 'work') return settings.value.workMinutes * 60
    if (phase.value === 'shortBreak') return settings.value.shortBreakMinutes * 60
    return settings.value.longBreakMinutes * 60
  })

  const progress = computed(() => {
    return 1 - (timeRemaining.value / totalSeconds.value)
  })

  const displayTime = computed(() => {
    const mins = Math.floor(timeRemaining.value / 60)
    const secs = timeRemaining.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  function saveSettings() {
    const today = new Date().toDateString()
    if (settings.value.lastDate !== today) {
      settings.value.completedToday = 0
      settings.value.lastDate = today
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  }

  function playSound() {
    if (!settings.value.sound) return
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }

  function tick() {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(timer)
      timer = null
      isRunning.value = false
      playSound()
      onPhaseComplete()
    }
  }

  function onPhaseComplete() {
    if (phase.value === 'work') {
      settings.value.completedToday++
      saveSettings()
      if (currentRound.value % settings.value.longBreakInterval === 0) {
        showNotification.value = 'timeForBreak'
        switchPhase('longBreak')
      } else {
        showNotification.value = 'timeForBreak'
        switchPhase('shortBreak')
      }
    } else {
      showNotification.value = 'timeForWork'
      switchPhase('work')
    }
    if (settings.value.autoStart) {
      start()
    }
  }

  function switchPhase(newPhase) {
    phase.value = newPhase
    if (newPhase === 'work') {
      timeRemaining.value = settings.value.workMinutes * 60
      if (phase.value === 'work' && currentRound.value === 0) currentRound.value = 1
    } else if (newPhase === 'shortBreak') {
      timeRemaining.value = settings.value.shortBreakMinutes * 60
    } else {
      timeRemaining.value = settings.value.longBreakMinutes * 60
    }
  }

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    showNotification.value = null
    timer = setInterval(tick, 1000)
  }

  function pause() {
    isRunning.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function reset() {
    pause()
    timeRemaining.value = totalSeconds.value
    showNotification.value = null
  }

  function skip() {
    pause()
    showNotification.value = null
    if (phase.value === 'work') {
      if (currentRound.value % settings.value.longBreakInterval === 0) {
        switchPhase('longBreak')
      } else {
        switchPhase('shortBreak')
      }
    } else {
      currentRound.value++
      switchPhase('work')
    }
  }

  function resetRounds() {
    pause()
    currentRound.value = 1
    phase.value = 'work'
    timeRemaining.value = settings.value.workMinutes * 60
    showNotification.value = null
  }

  watch(() => settings.value.workMinutes, () => {
    if (phase.value === 'work' && !isRunning.value) {
      timeRemaining.value = settings.value.workMinutes * 60
    }
    saveSettings()
  })
  watch(() => settings.value.shortBreakMinutes, () => {
    if (phase.value === 'shortBreak' && !isRunning.value) {
      timeRemaining.value = settings.value.shortBreakMinutes * 60
    }
    saveSettings()
  })
  watch(() => settings.value.longBreakMinutes, () => {
    if (phase.value === 'longBreak' && !isRunning.value) {
      timeRemaining.value = settings.value.longBreakMinutes * 60
    }
    saveSettings()
  })
  watch(() => settings.value.longBreakInterval, () => { saveSettings() })
  watch(() => settings.value.autoStart, () => { saveSettings() })
  watch(() => settings.value.sound, () => { saveSettings() })

  onMounted(() => {
    const today = new Date().toDateString()
    if (settings.value.lastDate !== today) {
      settings.value.completedToday = 0
      settings.value.lastDate = today
      saveSettings()
    }
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    settings, phase, currentRound, isRunning,
    timeRemaining, totalSeconds, progress, displayTime,
    showNotification,
    start, pause, reset, skip, resetRounds
  }
}
