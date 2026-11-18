<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const mode = ref('csv2json')
const input = ref('name,age,city\nAlice,30,Beijing\nBob,25,Shanghai')
const output = ref('')
const error = ref('')

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else {
      if (c === '"') {
        inQuotes = true
      } else if (c === ',') {
        row.push(field)
        field = ''
      } else if (c === '\n') {
        row.push(field)
        rows.push(row)
        row = []
        field = ''
      } else if (c !== '\r') {
        field += c
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''))
}

function csv2json() {
  const rows = parseCSV(input.value)
  if (!rows.length) {
    output.value = '[]'
    return
  }
  const headers = rows[0]
  const arr = rows.slice(1).map((r) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = r[i] !== undefined ? r[i] : ''
    })
    return obj
  })
  output.value = JSON.stringify(arr, null, 2)
}

function json2csv() {
  let arr
  try {
    arr = JSON.parse(input.value)
    if (!Array.isArray(arr)) throw new Error('JSON 必须为数组')
  } catch (e) {
    error.value = 'JSON 解析失败：' + e.message
    output.value = ''
    return
  }
  if (!arr.length) {
    output.value = ''
    return
  }
  const headers = [...new Set(arr.flatMap((o) => Object.keys(o)))]
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = [headers.join(',')]
  for (const o of arr) {
    lines.push(headers.map((h) => esc(o[h])).join(','))
  }
  output.value = lines.join('\n')
}

function run() {
  error.value = ''
  try {
    if (mode.value === 'csv2json') csv2json()
    else json2csv()
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

function swap() {
  mode.value = mode.value === 'csv2json' ? 'json2csv' : 'csv2json'
  input.value = output.value
  output.value = ''
  run()
}

run()
</script>

<template>
  <ToolLayout icon="📊" title="CSV ↔ JSON" description="CSV 与 JSON 数组相互转换，支持带引号的字段。">
    <div class="modes">
      <label><input type="radio" v-model="mode" value="csv2json" @change="run" /> CSV → JSON</label>
      <label><input type="radio" v-model="mode" value="json2csv" @change="run" /> JSON → CSV</label>
      <button class="ghost" @click="swap">⇄ 互换</button>
      <button @click="copy(output)" :disabled="!output">复制结果</button>
    </div>

    <div class="panes">
      <div class="pane">
        <div class="pane-title">{{ mode === 'csv2json' ? 'CSV 输入' : 'JSON 输入' }}</div>
        <textarea v-model="input" rows="12" spellcheck="false" @input="run"></textarea>
      </div>
      <div class="pane">
        <div class="pane-title">
          结果
          <span v-if="error" class="err">⚠ {{ error }}</span>
        </div>
        <textarea :value="output" rows="12" readonly spellcheck="false"></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.modes {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.err {
  color: var(--danger);
  font-weight: 400;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  outline: none;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

textarea:focus {
  border-color: var(--primary);
}

@media (max-width: 768px) {
  .panes {
    grid-template-columns: 1fr;
  }
}
</style>
