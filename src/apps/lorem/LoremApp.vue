<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
import { copy } from '../../utils/clipboard'

const paragraphs = ref(3)
const sentMin = ref(5)
const sentMax = ref(12)
const startWithLorem = ref(true)
const result = ref('')

const WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' '
  )

function rand(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function sentence() {
  const len = rand(sentMin.value, sentMax.value)
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)])
  }
  let s = arr.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

function generate() {
  const paras = []
  for (let p = 0; p < paragraphs.value; p++) {
    const sCount = rand(3, 6)
    const arr = []
    for (let s = 0; s < sCount; s++) arr.push(sentence())
    let para = arr.join(' ')
    if (p === 0 && startWithLorem.value) {
      para = 'Lorem ipsum dolor sit amet, ' + para.charAt(0).toLowerCase() + para.slice(1)
    }
    paras.push(para)
  }
  result.value = paras.join('\n\n')
}

generate()
</script>

<template>
  <ToolLayout icon="📄" title="Lorem 生成器" description="生成 Lorem Ipsum 占位文本，可配置段落数与句子长度。">
    <div class="opts">
      <label class="opt">段落数
        <input type="number" min="1" max="50" v-model.number="paragraphs" />
      </label>
      <label class="opt">句子最小词数
        <input type="number" min="2" max="30" v-model.number="sentMin" />
      </label>
      <label class="opt">句子最大词数
        <input type="number" min="2" max="40" v-model.number="sentMax" />
      </label>
      <label class="check"><input type="checkbox" v-model="startWithLorem" /> 首段以 "Lorem ipsum" 开头</label>
      <button @click="generate">生成</button>
      <button class="ghost" @click="copy(result)" :disabled="!result">复制</button>
    </div>

    <textarea :value="result" rows="14" readonly spellcheck="false"></textarea>
  </ToolLayout>
</template>

<style scoped>
.opts {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.opt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-soft);
  font-weight: 600;
}

.opt input {
  width: 90px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  font-weight: 400;
}

.check {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 13px;
}

button:hover:not(:disabled) {
  background: var(--primary-hover);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

button.ghost {
  background: transparent;
  color: var(--text-soft);
  border: 1px solid var(--border);
  margin-left: auto;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  outline: none;
}
</style>
