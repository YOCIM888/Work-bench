<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'
import CronPresets from './components/CronPresets.vue'
import CronBuilder from './components/CronBuilder.vue'
import CronPreview from './components/CronPreview.vue'
import { useCron } from './composables/useCron.js'

const { t } = useI18n()

const {
  fields, FIELDS, FIELD_RANGES,
  expression, error, nextExecutions,
  applyPreset, parseManualExpression, PRESETS
} = useCron()

const manualExpr = ref('')
const editMode = ref(false)

function handlePresetSelect(expr) {
  editMode.value = false
  applyPreset(expr)
}

function applyManual() {
  if (manualExpr.value.trim()) {
    parseManualExpression(manualExpr.value.trim())
  }
}

function startEdit() {
  manualExpr.value = expression.value
  editMode.value = true
}

function cancelEdit() {
  editMode.value = false
}
</script>

<template>
  <div class="cron-app">
    <CronPresets :presets="PRESETS" @select="handlePresetSelect" />

    <div class="edit-toggle" v-if="!editMode">
      <button class="btn-edit" @click="startEdit">{{ t('cronGenerator.editExpression') }}</button>
    </div>
    <div class="edit-row" v-else>
      <input v-model="manualExpr" type="text" class="edit-input" placeholder="* * * * * *" spellcheck="false" @keyup.enter="applyManual" />
      <button class="btn-apply" @click="applyManual">✓</button>
      <button class="btn-cancel" @click="cancelEdit">✕</button>
    </div>

    <CronBuilder
      :fields="fields"
      :field-names="FIELDS"
      :field-ranges="FIELD_RANGES"
    />

    <div class="divider"></div>

    <CronPreview
      :expression="expression"
      :error="error"
      :next-executions="nextExecutions"
    />
  </div>
</template>

<style scoped>
.cron-app {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  width: 100%;
  padding: 16px;
  overflow-y: auto;
}
.edit-toggle {
  display: flex;
}
.btn-edit {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #555;
  cursor: pointer;
}
.btn-edit:hover {
  background: #f0f0f0;
}
.edit-row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.edit-input {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  outline: none;
}
.edit-input:focus {
  border-color: #4a90d9;
}
.btn-apply, .btn-cancel {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-apply:hover {
  background: #d4edda;
}
.btn-cancel:hover {
  background: #f8d7da;
}
.divider {
  height: 1px;
  background: #eee;
}
</style>
