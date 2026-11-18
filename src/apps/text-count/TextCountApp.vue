<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const text = ref('在这里粘贴文本，即可实时统计字符、单词、行数等信息。')

const stats = computed(() => {
  const t = text.value
  const chars = t.length
  const charsNoSpace = t.replace(/\s/g, '').length
  const words = (t.trim().match(/\S+/g) || []).length
  const lines = t === '' ? 0 : t.split('\n').length
  const bytes = new TextEncoder().encode(t).length
  const sentences = (t.match(/[^。.!?!?\n]+[。.!?!?]+/g) || []).length || (t.trim() ? 1 : 0)
  const paragraphs = t.split(/\n\s*\n/).filter((p) => p.trim()).length
  return { chars, charsNoSpace, words, lines, bytes, sentences, paragraphs }
})
</script>

<template>
  <ToolLayout icon="🔢" title="文本统计" description="实时统计字符数、单词数、行数、字节数等。">
    <div class="grid">
      <div class="stat"><div class="num">{{ stats.chars }}</div><div class="lbl">字符数</div></div>
      <div class="stat"><div class="num">{{ stats.charsNoSpace }}</div><div class="lbl">字符(不含空格)</div></div>
      <div class="stat"><div class="num">{{ stats.words }}</div><div class="lbl">单词数</div></div>
      <div class="stat"><div class="num">{{ stats.lines }}</div><div class="lbl">行数</div></div>
      <div class="stat"><div class="num">{{ stats.bytes }}</div><div class="lbl">字节数 (UTF-8)</div></div>
      <div class="stat"><div class="num">{{ stats.sentences }}</div><div class="lbl">句子数</div></div>
      <div class="stat"><div class="num">{{ stats.paragraphs }}</div><div class="lbl">段落数</div></div>
    </div>

    <div class="pane">
      <div class="pane-title">输入文本</div>
      <textarea v-model="text" rows="10" spellcheck="false"></textarea>
    </div>
  </ToolLayout>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.num {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lbl {
  font-size: 12px;
  color: var(--text-soft);
  margin-top: 4px;
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
  font-size: 13px;
  line-height: 1.6;
  outline: none;
}

textarea:focus {
  border-color: var(--primary);
}
</style>
