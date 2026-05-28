import { ref } from 'vue'

export function useDomainLookup() {
  const query = ref('')
  const loading = ref(false)
  const ipInfo = ref(null)
  const dnsRecords = ref([])
  const httpHeaders = ref(null)
  const error = ref('')

  const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA']

  async function lookupIp() {
    try {
      const q = query.value.trim()
      const resp = await fetch(`http://ip-api.com/json/${q}`)
      const data = await resp.json()
      if (data.status === 'success') {
        ipInfo.value = {
          ip: data.query,
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          isp: data.isp,
          org: data.org,
          timezone: data.timezone,
          lat: data.lat,
          lon: data.lon
        }
      } else {
        ipInfo.value = null
      }
    } catch {
      ipInfo.value = null
    }
  }

  async function lookupDns(type) {
    try {
      const q = query.value.trim()
      const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(q)
      if (isIp) {
        dnsRecords.value = []
        return
      }
      const types = type ? [type] : DNS_TYPES
      const allRecords = []
      for (const t of types) {
        try {
          const resp = await fetch(`https://dns.google/resolve?name=${q}&type=${t}`)
          const data = await resp.json()
          if (data.Answer) {
            for (const ans of data.Answer) {
              allRecords.push({
                type: t,
                name: ans.name,
                ttl: ans.TTL,
                value: ans.data
              })
            }
          }
        } catch {}
      }
      dnsRecords.value = allRecords
    } catch {
      dnsRecords.value = []
    }
  }

  async function lookupHttpHeaders() {
    try {
      const q = query.value.trim()
      let url = q
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url
      }
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      const resp = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const headers = {}
      resp.headers.forEach((value, key) => {
        headers[key] = value
      })
      httpHeaders.value = {
        status: resp.status,
        statusText: resp.statusText,
        headers
      }
    } catch {
      httpHeaders.value = null
    }
  }

  async function lookupAll() {
    if (!query.value.trim()) return
    loading.value = true
    error.value = ''
    ipInfo.value = null
    dnsRecords.value = []
    httpHeaders.value = null

    await Promise.allSettled([
      lookupIp(),
      lookupDns(),
      lookupHttpHeaders()
    ])

    if (!ipInfo.value && dnsRecords.value.length === 0 && !httpHeaders.value) {
      error.value = 'error'
    }

    loading.value = false
  }

  function clear() {
    query.value = ''
    ipInfo.value = null
    dnsRecords.value = []
    httpHeaders.value = null
    error.value = ''
  }

  return {
    query, loading, error,
    ipInfo, dnsRecords, httpHeaders,
    DNS_TYPES,
    lookupAll, lookupDns, clear
  }
}
