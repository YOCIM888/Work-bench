<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const input = ref('<a href="https://tools.yocim.top">工具箱 & Demo</a>')
const encoded = ref('')
const decoded = ref('')

const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

function encode() {
  encoded.value = input.value.replace(/[&<>"']/g, (c) => escapeMap[c])
}

function decode() {
  const ta = document.createElement('textarea')
  ta.innerHTML = input.value
  decoded.value = ta.value
}

encode()
decode()
</script>

<template>
  <ToolLayout icon="🏷️" title="HTML 实体编解码" description="将特殊字符转义为 HTML 实体，或反向还原。">
    <div class="pane">
      <div class="pane-title">输入</div>
      <textarea v-model="input" rows="4" spellcheck="false" @input="encode(); decode()"></textarea>
    </div>

    <div class="panes">
      <div class="pane">
        <div class="pane-title">
          编码结果 (转义)
          <button class="mini" @click="copy(encoded)" :disabled="!encoded">复制</button>
        </div>
        <textarea :value="encoded" rows="4" readonly spellcheck="false"></textarea>
      </div>
      <div class="pane">
        <div class="pane-title">
          解码结果 (还原)
          <button class="mini" @click="copy(decoded)" :disabled="!decoded">复制</button>
        </div>
        <textarea :value="decoded" rows="4" readonly spellcheck="false"></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.pane {
  margin-bottom: 16px;
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

.mini {
  margin-left: auto;
  padding: 3px 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-soft);
  border-radius: 6px;
  font-size: 12px;
}

.mini:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  word-break: break-all;
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
