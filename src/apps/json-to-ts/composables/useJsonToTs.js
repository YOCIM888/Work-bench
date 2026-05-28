import { ref, computed } from 'vue'

export function useJsonToTs() {
  const inputJson = ref('')
  const rootName = ref('RootObject')
  const exportAs = ref('interface')
  const optionalFields = ref(true)
  const semicolons = ref(false)

  function getTypeName(key) {
    return key.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  }

  function jsonToTs(value, name, indent = 0) {
    const spaces = '  '.repeat(indent)
    const semi = semicolons.value ? ';' : ''
    const results = []

    if (value === null) {
      return { type: 'null', interfaces: [] }
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { type: 'never[]', interfaces: [] }
      }
      const types = []
      const allInterfaces = []
      for (const item of value) {
        const result = jsonToTs(item, name, indent)
        types.push(result.type)
        allInterfaces.push(...result.interfaces)
      }
      const uniqueTypes = [...new Set(types)]
      const arrayType = uniqueTypes.length === 1 ? uniqueTypes[0] : uniqueTypes.join(' | ')
      return { type: `${arrayType}[]`, interfaces: allInterfaces }
    }

    if (typeof value === 'object') {
      const props = []
      const childInterfaces = []
      for (const [key, val] of Object.entries(value)) {
        const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
        const childName = getTypeName(key)
        const result = jsonToTs(val, childName, indent + 1)
        const isOptional = optionalFields.value && (val === null || val === undefined)
        const optMark = isOptional ? '?' : ''
        props.push(`${spaces}  ${propName}${optMark}: ${result.type}${semi}`)
        childInterfaces.push(...result.interfaces)
      }

      const keyword = exportAs.value
      const interfaceStr = `${keyword} ${name} {\n${props.join('\n')}\n${spaces}}`
      childInterfaces.unshift(interfaceStr)

      return { type: name, interfaces: childInterfaces }
    }

    if (typeof value === 'string') return { type: 'string', interfaces: [] }
    if (typeof value === 'number') return { type: 'number', interfaces: [] }
    if (typeof value === 'boolean') return { type: 'boolean', interfaces: [] }

    return { type: 'unknown', interfaces: [] }
  }

  const outputTs = computed(() => {
    if (!inputJson.value.trim()) return ''
    try {
      const parsed = JSON.parse(inputJson.value)
      const result = jsonToTs(parsed, rootName.value || 'RootObject')
      return result.interfaces.join('\n\n')
    } catch {
      return null
    }
  })

  const error = computed(() => {
    if (!inputJson.value.trim()) return false
    return outputTs.value === null
  })

  const stats = computed(() => {
    if (!outputTs.value || outputTs.value === null) return null
    const interfaceCount = (outputTs.value.match(/^(interface|type)\s/gm) || []).length
    const propCount = (outputTs.value.match(/^\s+[a-zA-Z]/gm) || []).length
    return { interfaces: interfaceCount, props: propCount }
  })

  const SAMPLE_JSON = JSON.stringify({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    address: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.006 }
    },
    roles: ["admin", "user"],
    tags: [{ id: 1, name: "vip" }, { id: 2, name: "active" }],
    lastLogin: null
  }, null, 2)

  function loadSample() {
    inputJson.value = SAMPLE_JSON
  }

  function clearAll() {
    inputJson.value = ''
  }

  function downloadTs() {
    if (!outputTs.value || outputTs.value === null) return
    const blob = new Blob([outputTs.value], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rootName.value || 'types'}.ts`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    inputJson, rootName, exportAs, optionalFields, semicolons,
    outputTs, error, stats,
    loadSample, clearAll, downloadTs
  }
}
