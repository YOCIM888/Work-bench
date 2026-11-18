<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const input = ref('SOS tools.yocim.top')
const mode = ref('encode')

const morseMap = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',
  J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '@': '.--.-.'
}
const reverseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))

function encode(text) {
  return text
    .toUpperCase()
    .split('')
    .map((c) => (c === ' ' ? '/' : morseMap[c] || ''))
    .filter((x) => x !== '')
    .join(' ')
}

function decode(morse) {
  return morse
    .trim()
    .split(/\s+/)
    .map((code) => (code === '/' ? ' ' : reverseMap[code] || ''))
    .join('')
}

const output = computed(() => {
  if (!input.value.trim()) return ''
  return mode.value === 'encode' ? encode(input.value) : decode(input.value)
})

function swap() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
}
</script>

<template>
  <ToolLayout icon="📡" title="摩斯密码" description="文本与摩斯密码（ITU 标准）相互转换。">
    <div class="modes">
      <label><input type="radio" v-model="mode" value="encode" /> 编码</label>
      <label><input type="radio" v-model="mode" value="decode" /> 解码</label>
      <button class="ghost" @click="swap">⇄ 互换</button>
      <button @click="copy(output)" :disabled="!output">复制结果</button>
    </div>

    <div class="panes">
      <div class="pane">
        <div class="pane-title">{{ mode === 'encode' ? '文本' : '摩斯密码' }}</div>
        <textarea v-model="input" rows="6" spellcheck="false" :placeholder="mode === 'encode' ? '输入文本…' : '输入摩斯密码 (空格分隔字母, / 分隔单词)…'"></textarea>
      </div>
      <div class="pane">
        <div class="pane-title">结果</div>
        <textarea :value="output" rows="6" readonly spellcheck="false"></textarea>
      </div>
    </div>

    <div class="hint">提示：编码时字母用空格分隔，单词用 <code>/</code> 分隔。</div>
  </ToolLayout>
</template>

<style scoped>
.modes {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.modes label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modes button {
  margin-left: auto;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 13px;
}

.modes button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modes button.ghost {
  background: transparent;
  color: var(--text-soft);
  border: 1px solid var(--border);
  margin-left: 0;
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pane-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 6px;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

textarea:focus {
  border-color: var(--primary);
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-soft);
}

.hint code {
  background: var(--bg-hover);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

@media (max-width: 768px) {
  .panes {
    grid-template-columns: 1fr;
  }
}
</style>
