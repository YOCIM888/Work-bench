<script setup>
import ColorPanel from './components/ColorPanel.vue'
import ColorValues from './components/ColorValues.vue'
import ColorSwatches from './components/ColorSwatches.vue'
import { useColor } from './composables/useColor.js'

const {
  h, s, v,
  rgb, hsl, hex,
  hexString, rgbString, hslString,
  setFromRgb, setFromHex, setFromHsl,
  randomColor,
  savedColors,
  saveColor, removeColor, applyColor
} = useColor()
</script>

<template>
  <div class="color-picker-app">
    <div class="picker-main">
      <ColorPanel
        :hue="h"
        :saturation="s"
        :brightness="v"
        @update:hue="h = $event"
        @update:saturation="s = $event"
        @update:brightness="v = $event"
      />
      <ColorValues
        :hex="hex"
        :rgb="rgb"
        :hsl="hsl"
        :rgb-string="rgbString"
        :hsl-string="hslString"
        @set-hex="setFromHex"
        @set-rgb="setFromRgb"
        @set-hsl="setFromHsl"
      />
    </div>
    <div class="picker-sidebar">
      <ColorSwatches
        :saved-colors="savedColors"
        :current-hex="hex"
        @save="saveColor"
        @remove="removeColor"
        @apply="applyColor"
        @random="randomColor"
      />
    </div>
  </div>
</template>

<style scoped>
.color-picker-app {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 16px;
  gap: 20px;
}
.picker-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.picker-sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
</style>
