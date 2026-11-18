<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const query = ref('')

const statusCodes = [
  { code: 100, name: 'Continue', desc: '客户端应继续发送请求的剩余部分', group: '1xx 信息' },
  { code: 101, name: 'Switching Protocols', desc: '服务器同意切换协议', group: '1xx 信息' },
  { code: 200, name: 'OK', desc: '请求成功', group: '2xx 成功' },
  { code: 201, name: 'Created', desc: '请求已成功并创建了新资源', group: '2xx 成功' },
  { code: 202, name: 'Accepted', desc: '请求已接受，但尚未处理完成', group: '2xx 成功' },
  { code: 204, name: 'No Content', desc: '请求成功但无内容返回', group: '2xx 成功' },
  { code: 206, name: 'Partial Content', desc: '服务器返回了部分内容（范围请求）', group: '2xx 成功' },
  { code: 301, name: 'Moved Permanently', desc: '资源已永久重定向', group: '3xx 重定向' },
  { code: 302, name: 'Found', desc: '资源临时重定向', group: '3xx 重定向' },
  { code: 304, name: 'Not Modified', desc: '资源未修改，可使用缓存', group: '3xx 重定向' },
  { code: 307, name: 'Temporary Redirect', desc: '临时重定向，保持原请求方法', group: '3xx 重定向' },
  { code: 308, name: 'Permanent Redirect', desc: '永久重定向，保持原请求方法', group: '3xx 重定向' },
  { code: 400, name: 'Bad Request', desc: '请求语法错误，服务器无法理解', group: '4xx 客户端错误' },
  { code: 401, name: 'Unauthorized', desc: '未认证，需要登录凭证', group: '4xx 客户端错误' },
  { code: 403, name: 'Forbidden', desc: '服务器拒绝请求（无权限）', group: '4xx 客户端错误' },
  { code: 404, name: 'Not Found', desc: '请求的资源不存在', group: '4xx 客户端错误' },
  { code: 405, name: 'Method Not Allowed', desc: '请求方法不被允许', group: '4xx 客户端错误' },
  { code: 408, name: 'Request Timeout', desc: '请求超时', group: '4xx 客户端错误' },
  { code: 409, name: 'Conflict', desc: '请求存在冲突', group: '4xx 客户端错误' },
  { code: 410, name: 'Gone', desc: '资源已永久消失', group: '4xx 客户端错误' },
  { code: 413, name: 'Payload Too Large', desc: '请求体过大', group: '4xx 客户端错误' },
  { code: 414, name: 'URI Too Long', desc: '请求的 URI 过长', group: '4xx 客户端错误' },
  { code: 415, name: 'Unsupported Media Type', desc: '不支持的媒体类型', group: '4xx 客户端错误' },
  { code: 418, name: "I'm a Teapot", desc: '我是一个茶壶（彩蛋状态码）', group: '4xx 客户端错误' },
  { code: 422, name: 'Unprocessable Entity', desc: '请求格式正确但语义错误', group: '4xx 客户端错误' },
  { code: 429, name: 'Too Many Requests', desc: '请求过多，已被限流', group: '4xx 客户端错误' },
  { code: 500, name: 'Internal Server Error', desc: '服务器内部错误', group: '5xx 服务器错误' },
  { code: 501, name: 'Not Implemented', desc: '服务器不支持该请求方法', group: '5xx 服务器错误' },
  { code: 502, name: 'Bad Gateway', desc: '网关收到无效响应', group: '5xx 服务器错误' },
  { code: 503, name: 'Service Unavailable', desc: '服务不可用（过载或维护）', group: '5xx 服务器错误' },
  { code: 504, name: 'Gateway Timeout', desc: '网关等待上游响应超时', group: '5xx 服务器错误' },
  { code: 511, name: 'Network Authentication Required', desc: '需要网络认证（如登录门户）', group: '5xx 服务器错误' }
]

const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  const filtered = q
    ? statusCodes.filter(
        (s) => String(s.code).includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
      )
    : statusCodes
  const map = new Map()
  for (const s of filtered) {
    if (!map.has(s.group)) map.set(s.group, [])
    map.get(s.group).push(s)
  }
  return [...map.entries()].map(([group, items]) => ({ group, items }))
})
</script>

<template>
  <ToolLayout icon="📡" title="HTTP 状态码" description="查询常见 HTTP 状态码的含义，支持搜索。">
    <div class="search">
      <input v-model="query" type="text" placeholder="搜索状态码、名称或描述…" />
    </div>

    <div v-for="g in groups" :key="g.group" class="group">
      <div class="group-title">{{ g.group }}</div>
      <div class="list">
        <div v-for="s in g.items" :key="s.code" class="card" :class="'c' + s.group.split(' ')[0]">
          <div class="code">{{ s.code }}</div>
          <div class="info">
            <div class="name">{{ s.name }}</div>
            <div class="desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!groups.length" class="empty">未找到匹配的状态码</div>
  </ToolLayout>
</template>

<style scoped>
.search {
  margin-bottom: 20px;
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

.group {
  margin-bottom: 20px;
}

.group-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-soft);
  margin-bottom: 10px;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}

.card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
}

.code {
  font-size: 20px;
  font-weight: 800;
  font-family: 'SFMono-Regular', Consolas, monospace;
  width: 56px;
  flex-shrink: 0;
}

.card .info {
  min-width: 0;
}

.name {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}

.desc {
  font-size: 12px;
  color: var(--text-soft);
  line-height: 1.4;
}

.card .code {
  color: var(--text-soft);
}

.card.c1xx .code {
  color: #64748b;
}

.card.c2xx .code {
  color: var(--success);
}

.card.c3xx .code {
  color: #3b82f6;
}

.card.c4xx .code {
  color: #f59e0b;
}

.card.c5xx .code {
  color: var(--danger);
}

.empty {
  text-align: center;
  color: var(--text-soft);
  padding: 40px;
}
</style>
