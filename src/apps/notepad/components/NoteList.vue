<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  filteredNotes: { type: Array, default: () => [] },
  activeNoteId: { type: String, default: '' },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['select', 'create', 'delete', 'update:modelValue'])

function formatTime(timestamp) {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${day} ${h}:${min}`
}

function confirmDelete(id) {
  if (window.confirm(t('notepad.confirmDelete'))) {
    emit('delete', id)
  }
}
</script>

<template>
  <div class="note-list">
    <div class="note-list-header">
      <input
        class="search-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="t('notepad.searchPlaceholder')"
      />
      <button class="btn-new" @click="$emit('create')" :title="t('notepad.newNote')">+</button>
    </div>
    <div class="note-list-items">
      <div
        class="note-item"
        v-for="note in filteredNotes"
        :key="note.id"
        :class="{ active: note.id === activeNoteId }"
        @click="$emit('select', note.id)"
      >
        <div class="note-item-title">{{ note.title || t('notepad.untitled') }}</div>
        <div class="note-item-preview">{{ note.content.slice(0, 60) || t('notepad.emptyNote') }}</div>
        <div class="note-item-meta">
          <span class="note-item-time">{{ formatTime(note.updatedAt) }}</span>
          <button class="btn-delete" @click.stop="confirmDelete(note.id)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e5e5e5;
  background: #fafafa;
}
.note-list-header {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #e5e5e5;
}
.search-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  background: #fff;
}
.search-input:focus {
  border-color: #4a90d9;
}
.btn-new {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  flex-shrink: 0;
}
.btn-new:hover {
  background: #f0f0f0;
}
.note-list-items {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.note-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}
.note-item:hover {
  background: #f0f4f8;
}
.note-item.active {
  background: #e3edf7;
}
.note-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note-item-preview {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.note-item-time {
  font-size: 11px;
  color: #aaa;
}
.btn-delete {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.15s;
}
.note-item:hover .btn-delete {
  opacity: 1;
}
.btn-delete:hover {
  background: rgba(0, 0, 0, 0.08);
}
</style>
