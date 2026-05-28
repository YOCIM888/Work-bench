import { ref, computed } from 'vue'

export function useJsonViewer() {
  const jsonText = ref('')
  const searchQuery = ref('')
  const expandedPaths = ref(new Set(['root']))

  const parsedData = computed(() => {
    if (!jsonText.value.trim()) return null
    try {
      return JSON.parse(jsonText.value)
    } catch {
      return null
    }
  })

  const parseError = computed(() => {
    if (!jsonText.value.trim()) return null
    try {
      JSON.parse(jsonText.value)
      return null
    } catch (e) {
      return e.message
    }
  })

  function formatJson() {
    try {
      const obj = JSON.parse(jsonText.value)
      jsonText.value = JSON.stringify(obj, null, 2)
    } catch {}
  }

  function minifyJson() {
    try {
      const obj = JSON.parse(jsonText.value)
      jsonText.value = JSON.stringify(obj)
    } catch {}
  }

  function toggleExpand(path) {
    const s = new Set(expandedPaths.value)
    if (s.has(path)) {
      s.delete(path)
    } else {
      s.add(path)
    }
    expandedPaths.value = s
  }

  function collectPaths(obj, prefix) {
    const paths = []
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => {
          const p = prefix + '[' + i + ']'
          paths.push(p)
          paths.push(...collectPaths(item, p))
        })
      } else {
        Object.keys(obj).forEach(key => {
          const p = prefix + '.' + key
          paths.push(p)
          paths.push(...collectPaths(obj[key], p))
        })
      }
    }
    return paths
  }

  function expandAll() {
    if (!parsedData.value) return
    const allPaths = collectPaths(parsedData.value, 'root')
    allPaths.push('root')
    expandedPaths.value = new Set(allPaths)
  }

  function collapseAll() {
    expandedPaths.value = new Set(['root'])
  }

  function copyPath(path) {
    const displayPath = path.replace(/^root/, '')
    navigator.clipboard.writeText(displayPath || '$')
  }

  function isSearchMatch(key, value) {
    if (!searchQuery.value) return false
    const q = searchQuery.value.toLowerCase()
    const keyStr = String(key).toLowerCase()
    const valStr = String(value).toLowerCase()
    return keyStr.includes(q) || valStr.includes(q)
  }

  const stats = computed(() => {
    if (!parsedData.value) return { objects: 0, arrays: 0, values: 0 }
    let objects = 0
    let arrays = 0
    let values = 0
    function count(obj) {
      if (obj === null || obj === undefined) {
        values++
        return
      }
      if (Array.isArray(obj)) {
        arrays++
        obj.forEach(item => count(item))
      } else if (typeof obj === 'object') {
        objects++
        Object.values(obj).forEach(v => count(v))
      } else {
        values++
      }
    }
    count(parsedData.value)
    return { objects, arrays, values }
  })

  return {
    jsonText, searchQuery, expandedPaths,
    parsedData, parseError,
    formatJson, minifyJson,
    toggleExpand, expandAll, collapseAll,
    copyPath, isSearchMatch,
    stats
  }
}
