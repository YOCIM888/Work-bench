<script setup>
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' }
})
</script>

<template>
  <section class="tool tool-app">
    <header class="tool-header">
      <h1>
        <span v-if="icon" class="tool-icon">{{ icon }}</span>
        {{ title }}
      </h1>
      <p v-if="description">{{ description }}</p>
    </header>
    <div class="tool-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.tool-header {
  margin-bottom: 20px;
}

.tool-header h1 {
  margin: 0 0 6px;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-icon {
  font-size: 22px;
}

.tool-header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
}

.tool-body {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}
</style>
