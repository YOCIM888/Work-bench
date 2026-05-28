<script setup>
import { ref, computed } from 'vue'
import { useNotes } from './composables/useNotes.js'
import NoteList from './components/NoteList.vue'
import NoteEditor from './components/NoteEditor.vue'

const { filteredNotes, searchQuery, createNote, updateNote, deleteNote, getNote } = useNotes()

const activeNoteId = ref(null)

const activeNote = computed(() => activeNoteId.value ? getNote(activeNoteId.value) : null)

function handleCreate() {
  const note = createNote()
  activeNoteId.value = note.id
}

function handleSelect(id) {
  activeNoteId.value = id
}

function handleUpdate(updates) {
  if (activeNoteId.value) updateNote(activeNoteId.value, updates)
}

function handleDelete(id) {
  deleteNote(id)
  if (activeNoteId.value === id) {
    activeNoteId.value = filteredNotes.value.length > 0 ? filteredNotes.value[0].id : null
  }
}
</script>

<template>
  <div class="notepad-app">
    <NoteList
      :filtered-notes="filteredNotes"
      :active-note-id="activeNoteId"
      v-model="searchQuery"
      @select="handleSelect"
      @create="handleCreate"
      @delete="handleDelete"
      class="notepad-sidebar"
    />
    <NoteEditor
      :note="activeNote"
      @update="handleUpdate"
      class="notepad-main"
    />
  </div>
</template>

<style scoped>
.notepad-app {
  display: flex;
  height: 100%;
  width: 100%;
}
.notepad-sidebar {
  width: 260px;
  flex-shrink: 0;
}
.notepad-main {
  flex: 1;
  min-width: 0;
}
</style>
