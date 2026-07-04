import { ref, readonly } from 'vue'

export interface TransportItem {
  title: string
  detail: string
}

export interface WeddingConfig {
  dateZh: string
  dateGregorian: string
  dateLunar: string
  countdownTarget: string
  checkinTime: string
  startTime: string
  venue: string
  city: string
  address: string
  transportation: TransportItem[]
  mapsUrl: string
  tallyFormId: string
  thankYouMessage1: string
  thankYouMessage2: string
  thankYouMessage3: string
  thankYouGreeting: string
  copyright: string
  footerText: string
}

const _config = ref<WeddingConfig | null>(null)

function getDateKey(): '1010' | '1017' {
  // Hash history URL: /#/?date=1017  or plain ?date=1017
  const hash = window.location.hash
  const queryStr = hash.includes('?') ? hash.split('?')[1] : window.location.search.slice(1)
  const params = new URLSearchParams(queryStr)
  return params.get('date') === '1017' ? '1017' : '1010'
}

export async function loadWeddingConfig(): Promise<void> {
  const key = getDateKey()
  const res = await fetch(`${import.meta.env.BASE_URL}config/${key}.json`)
  _config.value = (await res.json()) as WeddingConfig
}

export function useWeddingConfig() {
  return readonly(_config)
}
