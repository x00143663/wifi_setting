const ADJECTIVES = ['Blue', 'Green', 'Happy', 'Cozy', 'Quick', 'Bright', 'Calm', 'Bold', 'Swift', 'Snug']
const NOUNS = ['Home', 'Nest', 'Zone', 'Base', 'Hub', 'Spot', 'Lounge', 'Den', 'Space', 'Corner']
const SUFFIXES = ['Network', 'WiFi', 'Connect', 'Link', 'Net', 'Web', '5G', 'Plus', 'Pro', 'Air']

export function generateSSIDVariants(baseWord: string): string[] {
  const clean = baseWord.trim().replace(/\s+/g, '').slice(0, 20)
  if (!clean) return []

  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1)
  const usedSuffixes = new Set(['Home', 'Network', 'WiFi', 'Connect'])
  const available = SUFFIXES.filter((s) => !usedSuffixes.has(s))
  const randomSuffix = available[Math.floor(Math.random() * available.length)]

  return [
    `${capitalized}Home`,
    `The${capitalized}Network`,
    `${capitalized}WiFi`,
    `${capitalized}Connect`,
    `${capitalized}${randomSuffix}`,
  ]
}

const WORD_PAIRS = [
  ['Blue', 'Sky'], ['Happy', 'Home'], ['Green', 'Leaf'], ['Bright', 'Star'], ['Calm', 'Lake'],
  ['Swift', 'Bird'], ['Cozy', 'Nest'], ['Bold', 'Fox'], ['Snug', 'Bear'], ['Wild', 'Rose'],
]

export function generatePasswords(): string[] {
  const passwords: string[] = []
  const symbols = ['!', '@', '#', '$', '&', '*']
  const used = new Set<string>()

  while (passwords.length < 3) {
    const [adj, noun] = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
    const num = Math.floor(Math.random() * 90) + 10
    const sym = symbols[Math.floor(Math.random() * symbols.length)]
    const candidate = `${adj}${noun}${sym}${num}`
    if (!used.has(candidate)) {
      used.add(candidate)
      passwords.push(candidate)
    }
  }

  return passwords
}

export function scorePassword(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (!/(.)\1{2,}/.test(password)) score++ // no 3+ repeated chars

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

export function pronouncePassword(password: string): string {
  return password.split('').map((c) => {
    if (c === '!') return 'exclamation'
    if (c === '@') return 'at'
    if (c === '#') return 'hash'
    if (c === '$') return 'dollar'
    if (c === '&') return 'and'
    if (c === '*') return 'star'
    return c
  }).join('-')
}

export function wifiQrString(ssid: string, password: string): string {
  const escapedSsid = ssid.replace(/[\\;,"]/g, (c) => `\\${c}`)
  const escapedPass = password.replace(/[\\;,"]/g, (c) => `\\${c}`)
  return `WIFI:T:WPA;S:${escapedSsid};P:${escapedPass};;`
}
