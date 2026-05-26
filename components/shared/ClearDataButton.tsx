'use client'

import { useWizardStore } from '@/lib/store'

export function ClearDataButton() {
  const store = useWizardStore()
  const hasSavedData = !!(store.routerId || store.provider || store.ssidName)

  if (!hasSavedData) return null

  return (
    <button
      onClick={() => store.reset()}
      className="mt-4 text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
    >
      Clear saved data
    </button>
  )
}
