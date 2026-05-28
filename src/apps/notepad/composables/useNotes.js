import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'yocim-bench-notepad-notes'

function loadNotes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

const notes = ref(loadNotes())

watch(notes, (val) => {
  saveNotes(val)
}, { deep: true })

export function useNotes() {
  const searchQuery = ref('')

  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) => b.updatedAt - a.updatedAt)
  })

  const filteredNotes = computed(() => {
    if (!searchQuery.value.trim()) return sortedNotes.value
    const q = searchQuery.value.toLowerCase()
    return sortedNotes.value.filter(note =>
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    )
  })

  function createNote() {
    const note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    notes.value.unshift(note)
    return note
  }

  function updateNote(id, updates) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates, updatedAt: Date.now() }
    }
  }

  function deleteNote(id) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
    }
  }

  function getNote(id) {
    return notes.value.find(n => n.id === id)
  }

  return {
    notes,
    searchQuery,
    sortedNotes,
    filteredNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote
  }
}
