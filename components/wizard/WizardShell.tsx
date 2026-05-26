'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/lib/store'
import { M1_RouterID } from './modules/M1_RouterID'
import { M2_RouterAccess } from './modules/M2_RouterAccess'

const MODULES = [
  { label: 'Your Router', component: M1_RouterID },
  { label: 'Login', component: M2_RouterAccess },
]

const TOTAL = MODULES.length

export function WizardShell() {
  const router = useRouter()
  const { currentModule, prevModule } = useWizardStore()

  useEffect(() => {
    if (currentModule >= TOTAL) {
      router.replace('/configure')
    }
  }, [currentModule, router])

  if (currentModule >= TOTAL) return null

  const { component: ActiveModule, label } = MODULES[currentModule]
  const progress = Math.round((currentModule / TOTAL) * 100)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        {currentModule > 0 && (
          <button
            onClick={prevModule}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none transition-colors"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-xs text-gray-400">Step {currentModule + 1} of {TOTAL}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-4 py-2 flex justify-center gap-2">
        {MODULES.map((m, i) => (
          <div
            key={m.label}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < currentModule ? 'w-6 bg-emerald-500' :
              i === currentModule ? 'w-6 bg-emerald-400' :
              'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <ActiveModule />
        </div>
      </main>
    </div>
  )
}
