import { ref, computed } from 'vue'
import yaml from 'js-yaml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

export function useDataConverter() {
  const inputText = ref('')
  const sourceFormat = ref('json')
  const targetFormat = ref('yaml')

  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => false
  })

  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    indentBy: '  '
  })

  function detectFormat(text) {
    const trimmed = text.trim()
    if (!trimmed) return 'json'
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json'
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) return 'xml'
    if (trimmed.includes(': ') && !trimmed.includes('<')) return 'yaml'
    return 'json'
  }

  function autoDetect() {
    if (!inputText.value.trim()) return
    sourceFormat.value = detectFormat(inputText.value)
  }

  function parseToJsObject(text, format) {
    if (format === 'json') {
      return JSON.parse(text)
    } else if (format === 'yaml') {
      return yaml.load(text)
    } else if (format === 'xml') {
      return xmlParser.parse(text)
    }
    throw new Error('Unknown format')
  }

  function fromJsObject(obj, format) {
    if (format === 'json') {
      return JSON.stringify(obj, null, 2)
    } else if (format === 'yaml') {
      return yaml.dump(obj, { indent: 2, lineWidth: -1 })
    } else if (format === 'xml') {
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlBuilder.build(obj)
    }
    throw new Error('Unknown format')
  }

  const outputText = computed(() => {
    if (!inputText.value.trim()) return ''
    try {
      const obj = parseToJsObject(inputText.value, sourceFormat.value)
      return fromJsObject(obj, targetFormat.value)
    } catch {
      return null
    }
  })

  const error = computed(() => {
    if (!inputText.value.trim()) return false
    return outputText.value === null
  })

  function swapFormats() {
    const currentOutput = outputText.value
    const tempFormat = sourceFormat.value
    sourceFormat.value = targetFormat.value
    targetFormat.value = tempFormat
    if (currentOutput && currentOutput !== null) {
      inputText.value = currentOutput
    }
  }

  function clearAll() {
    inputText.value = ''
  }

  function download() {
    if (!outputText.value || outputText.value === null) return
    const extensions = { json: '.json', yaml: '.yaml', xml: '.xml' }
    const mimeTypes = { json: 'application/json', yaml: 'text/yaml', xml: 'application/xml' }
    const ext = extensions[targetFormat.value] || '.txt'
    const mime = mimeTypes[targetFormat.value] || 'text/plain'
    const blob = new Blob([outputText.value], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    inputText, sourceFormat, targetFormat,
    outputText, error,
    autoDetect, swapFormats, clearAll, download
  }
}
