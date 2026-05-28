import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'yocim-bench-color-picker-saved'

function loadSaved() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function useColor() {
  const h = ref(0)
  const s = ref(100)
  const v = ref(100)

  const savedColors = ref(loadSaved())

  watch(savedColors, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {}
  }, { deep: true })

  function hsvToRgb(h, s, v) {
    s /= 100
    v /= 100
    const c = v * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = v - c
    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let hh = 0
    if (d !== 0) {
      if (max === r) hh = 60 * (((g - b) / d) % 6)
      else if (max === g) hh = 60 * ((b - r) / d + 2)
      else hh = 60 * ((r - g) / d + 4)
    }
    if (hh < 0) hh += 360
    const ss = max === 0 ? 0 : (d / max) * 100
    const vv = max * 100
    return { h: Math.round(hh), s: Math.round(ss), v: Math.round(vv) }
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let hh = 0
    if (d !== 0) {
      if (max === r) hh = 60 * (((g - b) / d) % 6)
      else if (max === g) hh = 60 * ((b - r) / d + 2)
      else hh = 60 * ((r - g) / d + 4)
    }
    if (hh < 0) hh += 360
    const ll = (max + min) / 2
    const ss = d === 0 ? 0 : d / (1 - Math.abs(2 * ll - 1))
    return { h: Math.round(hh), s: Math.round(ss * 100), l: Math.round(ll * 100) }
  }

  function hslToRgb(hh, ss, ll) {
    ss /= 100; ll /= 100
    const c = (1 - Math.abs(2 * ll - 1)) * ss
    const x = c * (1 - Math.abs((hh / 60) % 2 - 1))
    const m = ll - c / 2
    let r = 0, g = 0, b = 0
    if (hh < 60) { r = c; g = x; b = 0 }
    else if (hh < 120) { r = x; g = c; b = 0 }
    else if (hh < 180) { r = 0; g = c; b = x }
    else if (hh < 240) { r = 0; g = x; b = c }
    else if (hh < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    if (hex.length !== 6) return null
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return { r, g, b }
  }

  const rgb = computed(() => hsvToRgb(h.value, s.value, v.value))

  const hsl = computed(() => rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b))

  const hex = computed(() => rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b))

  const hexString = computed(() => hex.value)

  const rgbString = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)

  const hslString = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`)

  function setFromRgb(r, g, b) {
    const hsv = rgbToHsv(r, g, b)
    h.value = hsv.h
    s.value = hsv.s
    v.value = hsv.v
  }

  function setFromHex(hexVal) {
    const result = hexToRgb(hexVal)
    if (result) setFromRgb(result.r, result.g, result.b)
  }

  function setFromHsl(hh, ss, ll) {
    const result = hslToRgb(hh, ss, ll)
    setFromRgb(result.r, result.g, result.b)
  }

  function randomColor() {
    h.value = Math.floor(Math.random() * 360)
    s.value = Math.floor(Math.random() * 60) + 40
    v.value = Math.floor(Math.random() * 40) + 60
  }

  function saveColor() {
    const color = hex.value
    if (!savedColors.value.includes(color)) {
      savedColors.value.push(color)
    }
  }

  function removeColor(color) {
    const index = savedColors.value.indexOf(color)
    if (index !== -1) savedColors.value.splice(index, 1)
  }

  function applyColor(color) {
    setFromHex(color)
  }

  return {
    h, s, v,
    rgb, hsl, hex,
    hexString, rgbString, hslString,
    setFromRgb, setFromHex, setFromHsl,
    randomColor,
    savedColors,
    saveColor, removeColor, applyColor
  }
}
