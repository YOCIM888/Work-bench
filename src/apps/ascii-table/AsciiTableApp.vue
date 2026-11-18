<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const query = ref('')

const controlNames = {
  0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
  8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
  16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB',
  24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US',
  32: 'SP', 127: 'DEL'
}

const allRows = Array.from({ length: 128 }, (_, i) => {
  const isControl = i < 32 || i === 127
  return {
    dec: i,
    hex: '0x' + i.toString(16).toUpperCase().padStart(2, '0'),
    oct: '0' + i.toString(8).padStart(3, '0'),
    char: isControl ? controlNames[i] : String.fromCharCode(i),
    isControl
  }
})

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allRows
  return allRows.filter(
    (r) =>
      String(r.dec).includes(q) ||
      r.hex.toLowerCase().includes(q) ||
      r.oct.includes(q) ||
      r.char.toLowerCase().includes(q)
  )
})
</script>

<template>
  <ToolLayout icon="🔤" title="ASCII 表" description="查询 0-127 的 ASCII 字符及其十进制、十六进制、八进制表示。">
    <div class="search">
      <input v-model="query" type="text" placeholder="搜索十进制 / 十六进制 / 字符…" />
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>字符</th><th>十进制</th><th>十六进制</th><th>八进制</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.dec" :class="{ ctrl: r.isControl }">
            <td class="ch">{{ r.char }}</td>
            <td class="mono">{{ r.dec }}</td>
            <td class="mono">{{ r.hex }}</td>
            <td class="mono">{{ r.oct }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ToolLayout>
</template>

<style scoped>
.search {
  margin-bottom: 16px;
}

.search input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search input:focus {
  border-color: var(--primary);
}

.table-wrap {
  max-height: 520px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th {
  position: sticky;
  top: 0;
  background: var(--bg-soft);
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--text-soft);
  border-bottom: 1px solid var(--border);
}

td {
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
}

tr:hover td {
  background: var(--bg-hover);
}

.ch {
  font-weight: 700;
  font-size: 15px;
}

tr.ctrl .ch {
  color: var(--text-soft);
  font-weight: 500;
  font-size: 13px;
}

.mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--text-soft);
}
</style>
