'use client'

import { useState } from 'react'
import { useWizardStore } from '@/lib/store'
import { getRouterById } from '@/lib/routers-db'
import { TellMeMore } from '@/components/shared/TellMeMore'

export function M2_RouterAccess() {
  const { routerId, provider, nextModule } = useWizardStore()
  const [confirmed, setConfirmed] = useState<boolean | null>(null)

  const router = routerId ? getRouterById(routerId) : null
  const adminUrl = router?.adminUrl ?? '192.168.1.1'
  const username = router?.defaultUsername ?? 'admin'
  const passwordHint = router?.defaultPasswordHint ?? 'printed on the label on your router'
  const labelLoc = router?.labelLocation ?? 'back'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Open your router's control panel</h1>
        <p className="text-gray-500 mt-1">
          Think of this as the "settings menu" for your internet box. We'll use it to make all the changes.
        </p>
      </div>

      {/* Connection requirement */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">📡 Before you start</p>
        <p>The device you're using right now must be connected to your router — either:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li><strong>Via WiFi</strong> — connect using the default name and password printed on your router's label</li>
          <li><strong>Via cable</strong> — plug an ethernet cable from your router into your laptop or computer</li>
        </ul>
        <p className="mt-2 text-blue-600">This won't work over mobile data — you must be on your home network.</p>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
          <p className="font-medium text-gray-900">Open your web browser</p>
        </div>
        <p className="text-sm text-gray-500 ml-10">
          That's the app you use to visit websites — Chrome, Safari, Firefox, or Edge.
        </p>
        <div className="ml-10">
          <TellMeMore>
            A web browser is the app on your phone or computer that lets you visit websites like Google or YouTube.
            You don't need the internet connection to work for this step — just open the browser app itself.
          </TellMeMore>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
          <p className="font-medium text-gray-900">Type this address in the top bar</p>
        </div>
        <div className="ml-10">
          {router ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 mt-1">
              <span className="font-mono font-bold text-lg text-emerald-700 select-all">{adminUrl}</span>
              <button
                onClick={() => navigator.clipboard.writeText(adminUrl)}
                className="ml-auto text-xs text-gray-500 hover:text-emerald-600 border border-gray-300 rounded px-2 py-1 transition-colors"
              >
                Copy
              </button>
            </div>
          ) : (
            <div className="mt-1 space-y-2">
              <p className="text-sm text-gray-600">Router model not identified — try these common addresses one at a time:</p>
              {['192.168.0.1', '192.168.1.1'].map((ip) => (
                <div key={ip} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <span className="font-mono font-bold text-emerald-700 select-all">{ip}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(ip)}
                    className="ml-auto text-xs text-gray-500 hover:text-emerald-600 border border-gray-300 rounded px-2 py-1 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Type this exactly in the address bar at the top (not the Google search bar).
          </p>
          <TellMeMore>
            This is your router's private address — it only works when you're connected to your home WiFi or plugged in with a cable.
            It's not a real website on the internet.
          </TellMeMore>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
          <p className="font-medium text-gray-900">Log in with these details</p>
        </div>
        <div className="ml-10 space-y-2 mt-1">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-20">Username:</span>
            <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold">{username}</code>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gray-500 w-20">Password:</span>
            <span className="text-gray-700">
              {passwordHint}
              <span className="block text-xs text-amber-700 mt-1">
                📍 Look at the {labelLoc} of your router — there's a sticker with all the details.
              </span>
            </span>
          </div>
          <TellMeMore>
            This is not the same password you use to connect to WiFi. This is a separate password
            to access the router's settings. It's printed on a sticker on your router — usually
            at the {labelLoc}. We'll help you change it to something only you know, shortly.
          </TellMeMore>
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="font-medium text-gray-800 mb-3">Did you see the login page or the router's control panel?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmed(true)}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
              confirmed === true ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
            }`}
          >
            ✅ Yes, I can see it
          </button>
          <button
            onClick={() => setConfirmed(false)}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
              confirmed === false ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
            }`}
          >
            ❓ No, it didn't work
          </button>
        </div>

        {confirmed === false && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-2">
            <p className="font-semibold">Try these fixes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure you're connected to your home WiFi (or use a cable)</li>
              <li>Type the address in the address bar at the top — not in Google search</li>
              <li>Try a different browser (Chrome, Firefox, Safari)</li>
              {provider === 'Virgin Media' && <li>Virgin Media Hub may use <code className="bg-white px-1 rounded">192.168.0.1</code> instead</li>}
              <li>Restart your router: unplug it, wait 30 seconds, plug it back in</li>
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={nextModule}
        disabled={confirmed !== true}
        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}
