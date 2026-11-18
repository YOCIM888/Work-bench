<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const token = ref('')
const error = ref('')

function b64urlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return decodeURIComponent(escape(atob(s)))
}

const result = computed(() => {
  error.value = ''
  const t = token.value.trim()
  if (!t) return null
  const parts = t.split('.')
  if (parts.length < 2) {
    error.value = 'JWT 格式错误：应至少包含 2 个由 "." 分隔的部分'
    return null
  }
  try {
    const header = JSON.parse(b64urlDecode(parts[0]))
    const payload = JSON.parse(b64urlDecode(parts[1]))
    let expInfo = ''
    let expStatus = ''
    if (payload.exp) {
      const d = new Date(payload.exp * 1000)
      const expired = Date.now() > payload.exp * 1000
      expInfo = d.toLocaleString('zh-CN', { hour12: false })
      expStatus = expired ? '已过期' : '有效'
    }
    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      expInfo,
      expStatus
    }
  } catch (e) {
    error.value = '解析失败：' + e.message
    return null
  }
})
</script>

<template>
  <ToolLayout icon="🎫" title="JWT 解码器" description="解析 JWT 的 Header 与 Payload（不验证签名），显示过期状态。">
    <div class="pane">
      <div class="pane-title">粘贴 JWT</div>
      <textarea v-model="token" rows="5" spellcheck="false" placeholder="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.xxx"></textarea>
    </div>

    <div v-if="error" class="err">⚠ {{ error }}</div>

    <div v-if="result" class="panes">
      <div class="pane">
        <div class="pane-title">Header</div>
        <pre>{{ result.header }}</pre>
      </div>
      <div class="pane">
        <div class="pane-title">
          Payload
          <span v-if="result.expInfo" class="exp" :class="{ expired: result.expStatus === '已过期' }">
            过期：{{ result.expInfo }} ({{ result.expStatus }})
          </span>
        </div>
        <pre>{{ result.payload }}</pre>
      </div>
    </div>
  </ToolLayout>
</template>

<style scoped>
.pane-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.exp {
  margin-left: auto;
  font-weight: 400;
  font-size: 11px;
  color: var(--success);
}

.exp.expired {
  color: var(--danger);
}

.err {
  color: var(--danger);
  font-size: 13px;
  margin-bottom: 12px;
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

pre {
  margin: 0;
  padding: 12px;
  background: var(--code-bg);
  color: var(--code-fg);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
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
