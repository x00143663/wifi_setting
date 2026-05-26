'use client'

import { useWizardStore } from '@/lib/store'

export function ClearDataButton() {
  const store = useWizardStore()
  const hasSavedData = !!(store.routerId || store.provider || store.ssidName)

  if (!hasSavedData) return null

  return (
    <div className="relative group mt-3">
      <button
        onClick={() => store.reset()}
        className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
      >
        Clear saved data
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center leading-relaxed">
        We found data from your last session. Click to start fresh.
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  )
}
