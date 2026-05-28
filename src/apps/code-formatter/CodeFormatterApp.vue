<script setup>
import CodeInput from './components/CodeInput.vue'
import CodeOutput from './components/CodeOutput.vue'
import { useFormatter } from './composables/useFormatter.js'

const {
  inputCode, outputCode, language, indentSize, indentType,
  formatCode, clearAll, getExtension
} = useFormatter()
</script>

<template>
  <div class="formatter-app">
    <CodeInput
      v-model="inputCode"
      :language="language"
      :indent-size="indentSize"
      :indent-type="indentType"
      @update:language="language = $event"
      @update:indent-size="indentSize = $event"
      @update:indent-type="indentType = $event"
      @format="formatCode"
      @clear="clearAll"
      class="formatter-input"
    />
    <CodeOutput
      :code="outputCode"
      :extension="getExtension()"
      class="formatter-output"
    />
  </div>
</template>

<style scoped>
.formatter-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.formatter-input {
  flex: 1;
  min-height: 0;
  border-bottom: 1px solid #e5e5e5;
}
.formatter-output {
  flex: 1;
  min-height: 0;
}
</style>
