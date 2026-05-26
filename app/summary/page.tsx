'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/lib/store'
import { getRouterById } from '@/lib/routers-db'
import { wifiQrString } from '@/lib/generators'
import QRCode from 'qrcode'

function QRCodeImg({ ssid, password, label }: { ssid: string; password: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !ssid || !password) return
    QRCode.toCanvas(canvasRef.current, wifiQrString(ssid, password), {
      width: 160,
      margin: 2,
      color: { dark: '#064e3b', light: '#ffffff' },
    })
  }, [ssid, password])

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas ref={canvasRef} className="rounded-lg border border-gray-200" />
      <p className="text-sm font-semibold text-gray-800 text-center mt-1">{ssid}</p>
      <p className="text-xs text-gray-500 text-center">{label}</p>
    </div>
  )
}

const SECURITY_LABELS: Record<string, string> = {
  'admin-password': 'Router admin password changed',
  'disable-wps': 'WPS disabled',
  'enable-firewall': 'Firewall enabled',
  'firmware-update': 'Firmware updated',
  'hide-ssid': 'WiFi name hidden',
}

export default function SummaryPage() {
  const router = useRouter()
  const store = useWizardStore()
  const routerInfo = store.routerId ? getRouterById(store.routerId) : null
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!store.ssidName && !store.routerId) {
      router.replace('/')
      return
    }
    setReady(true)
  }, [store.ssidName, store.routerId, router])

  if (!ready) return null

  const checkedItems = Object.entries(store.securityItems)
    .filter(([, v]) => v)
    .map(([k]) => k)

  function printQROnly() {
    const canvases = document.querySelectorAll<HTMLCanvasElement>('#qr-section canvas')
    const ssids = [store.ssidName, store.guestName].filter(Boolean)
    const labels = ['Main WiFi', 'Guest WiFi']

    let items = ''
    canvases.forEach((canvas, i) => {
      const dataUrl = canvas.toDataURL()
      items += `
        <div style="text-align:center;margin:0 16px">
          <img src="${dataUrl}" style="border:1px solid #ccc;border-radius:8px" />
          <p style="font-family:sans-serif;font-size:14px;font-weight:bold;margin:8px 0 2px">${ssids[i] ?? ''}</p>
          <p style="font-family:sans-serif;font-size:12px;color:#666;margin:0">${labels[i] ?? ''}</p>
        </div>`
    })

    const win = window.open('', '_blank', 'width=500,height=400')
    if (!win) return
    win.document.write(`
      <html><head><title>WiFi QR Codes</title></head>
      <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fff">
        <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:center;padding:32px">${items}</div>
      </body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-700 text-white px-4 py-8 text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold">Your WiFi is set up!</h1>
        <p className="text-emerald-200 mt-1 text-sm">Here's a summary of everything you configured.</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Completed steps */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-bold text-gray-900 mb-3">What you completed</h2>
          <ul className="space-y-2 text-sm">
            {store.routerId && (
              <li className="flex items-center gap-2 text-emerald-700">
                <span>✅</span> Router identified: {routerInfo ? `${routerInfo.provider} ${routerInfo.model}` : store.provider}
              </li>
            )}
            {store.ssidName && (
              <li className="flex items-center gap-2 text-emerald-700">
                <span>✅</span> WiFi name set to: <strong>{store.ssidName}</strong>
              </li>
            )}
            {store.wifiPassword && (
              <li className="flex items-center gap-2 text-emerald-700">
                <span>✅</span> Strong WiFi password set
              </li>
            )}
            {store.guestName && store.guestPassword && (
              <li className="flex items-center gap-2 text-emerald-700">
                <span>✅</span> Guest network created: <strong>{store.guestName}</strong>
              </li>
            )}
            {checkedItems.map((id) => (
              <li key={id} className="flex items-center gap-2 text-emerald-700">
                <span>✅</span> {SECURITY_LABELS[id] ?? id}
              </li>
            ))}
          </ul>
        </div>

        {/* WiFi details card */}
        <div className="bg-white rounded-xl border-2 border-emerald-400 p-5 print:border-black" id="wifi-card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Your WiFi Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-500">WiFi Name</span>
              <strong className="font-mono text-gray-900">{store.ssidName || '—'}</strong>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-500">WiFi Password</span>
              <strong className="font-mono text-gray-900">{store.wifiPassword || '—'}</strong>
            </div>
            {store.guestName && (
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-500">Guest Network</span>
                <strong className="font-mono text-gray-900">{store.guestName}</strong>
              </div>
            )}
            {store.guestPassword && (
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-500">Guest Password</span>
                <strong className="font-mono text-gray-900">{store.guestPassword}</strong>
              </div>
            )}
            {routerInfo && (
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-500">Router Admin</span>
                <code className="text-gray-700">{routerInfo.adminUrl}</code>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            💡 Cut out this card and keep it in a drawer — not on the fridge where visitors can see it.
          </div>
        </div>

        {/* QR Codes */}
        {store.ssidName && store.wifiPassword && (
          <div className="bg-white rounded-xl border border-gray-200 p-4" id="qr-section">
            <h2 className="font-bold text-gray-900 mb-1">WiFi QR Codes</h2>
            <p className="text-sm text-gray-500 mb-4">
              Visitors can scan these with their phone camera to connect instantly — no typing needed.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <QRCodeImg ssid={store.ssidName} password={store.wifiPassword} label="Main WiFi" />
              {store.guestName && store.guestPassword && (
                <QRCodeImg ssid={store.guestName} password={store.guestPassword} label="Guest WiFi" />
              )}
            </div>
            <button
              onClick={printQROnly}
              className="mt-4 w-full py-2 border-2 border-emerald-400 text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 transition-colors text-sm"
            >
              🖨️ Print QR code only
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            🖨️ Print this page
          </button>
          <button
            onClick={() => router.push('/configure')}
            className="w-full py-3 border-2 border-emerald-400 text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 transition-colors"
          >
            ← Back to configuration
          </button>
          <button
            onClick={() => {
              store.reset()
              router.push('/')
            }}
            className="w-full py-3 border-2 border-gray-300 text-gray-600 font-medium rounded-xl hover:border-gray-400 transition-colors"
          >
            Start over
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Your settings are saved in this browser. They won't be shared or stored online.
        </p>
      </div>

      <style>{`
        @media print {
          body > *:not(#wifi-card) { display: none; }
          #wifi-card { border: 2px solid black; padding: 20px; }
        }
      `}</style>
    </div>
  )
}
