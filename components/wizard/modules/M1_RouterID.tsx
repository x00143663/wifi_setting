'use client'

import { useWizardStore } from '@/lib/store'
import { PROVIDERS, getRoutersByProvider, Provider } from '@/lib/routers-db'
import { TellMeMore } from '@/components/shared/TellMeMore'

const PROVIDER_ICONS: Record<string, string> = {
  'Eir': '🟦',
  'Virgin Media': '🔴',
  'Sky': '🌐',
  'Vodafone': '🔵',
  'Other': '📡',
}

export function M1_RouterID() {
  const { provider, routerId, setField, nextModule } = useWizardStore()

  const routers = provider && provider !== 'Other' ? getRoutersByProvider(provider as Provider) : []
  const canContinue = provider !== null && (provider === 'Other' || routerId !== null)

  function selectProvider(p: string) {
    setField('provider', p)
    setField('routerId', null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Identify your router</h1>
        <p className="text-gray-500 mt-1">We'll use this to give you the exact steps for your device.</p>
      </div>

      {/* Provider */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Who is your internet provider?</h2>
        <div className="grid grid-cols-2 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              onClick={() => selectProvider(p)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                provider === p
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 bg-white hover:border-emerald-300'
              }`}
            >
              <span className="text-xl">{PROVIDER_ICONS[p]}</span>
              <span className="font-medium text-gray-900 text-sm">{p}</span>
              {provider === p && <span className="ml-auto text-emerald-500">✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Router model */}
      {provider && provider !== 'Other' && routers.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Which model is your router?</h2>
          <TellMeMore>
            Look at the sticker on the {routers[0]?.labelLocation ?? 'back'} of your router box.
            You'll see a model name printed there — it usually starts with letters followed by numbers.
          </TellMeMore>
          <div className="mt-3 space-y-3">
            {routers.map((r) => (
              <button
                key={r.id}
                onClick={() => setField('routerId', r.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  routerId === r.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                <span className="text-3xl">📶</span>
                <div>
                  <div className="font-semibold text-gray-900">{r.model}</div>
                  <div className="text-xs text-gray-500">Admin: {r.adminUrl}</div>
                </div>
                {routerId === r.id && <span className="ml-auto text-emerald-500 text-xl">✓</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {provider === 'Other' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 space-y-2">
          <p>We'll show you general instructions that work for most routers. The steps might look slightly different on your device, but the idea is the same.</p>
          <p className="font-semibold">Common admin addresses to try:</p>
          <div className="flex gap-2">
            <code className="bg-white px-2 py-1 rounded border border-amber-300">192.168.0.1</code>
            <code className="bg-white px-2 py-1 rounded border border-amber-300">192.168.1.1</code>
          </div>
          <p>Check the sticker on the back or bottom of your router — the admin address is usually printed there.</p>
        </div>
      )}

      <button
        onClick={nextModule}
        disabled={!canContinue}
        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}
