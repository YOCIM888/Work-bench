<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  outputTs: { type: String, default: '' },
  error: { type: Boolean, default: false },
  stats: { type: Object, default: null }
})

const emit = defineEmits(['download'])

const copied = ref(false)

function copyOutput() {
  if (props.outputTs) {
    navigator.clipboard.writeText(props.outputTs).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1500)
    })
  }
}
</script>

<template>
  <div class="ts-output">
    <div class="output-header">
      <span class="section-label">{{ t('jsonToTs.output') }}</span>
      <div class="output-info" v-if="stats">
        {{ t('jsonToTs.stats', { interfaces: stats.interfaces, props: stats.props }) }}
      </div>
      <div class="output-actions">
        <button class="btn-action" @click="copyOutput" v-if="outputTs && !error">
          {{ copied ? t('jsonToTs.copied') : t('jsonToTs.copy') }}
        </button>
        <button class="btn-action" @click="$emit('download')" v-if="outputTs && !error">
          {{ t('jsonToTs.download') }}
        </button>
      </div>
    </div>
    <div class="error-msg" v-if="error">{{ t('jsonToTs.error') }}</div>
    <textarea
      v-else
      :value="outputTs || ''"
      class="ts-textarea"
      readonly
      :placeholder="t('jsonToTs.output')"
    ></textarea>
  </div>
</template>

<style scoped>
.ts-output {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.section-label {
  font-size: 12px;
  color: #888;
}
.output-info {
  font-size: 11px;
  color: #aaa;
}
.output-actions {
  display: flex;
  gap: 4px;
}
.btn-action {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  color: #555;
  cursor: pointer;
}
.btn-action:hover {
  background: #f0f0f0;
}
.error-msg {
  flex: 1;
  padding: 8px;
  color: #e74c3c;
  background: #fef5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 13px;
}
.ts-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  outline: none;
  resize: none;
  background: #f9f9f9;
}
</style>
