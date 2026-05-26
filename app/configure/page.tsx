'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/lib/store'
import { getRouterById } from '@/lib/routers-db'
import { generateSSIDVariants, generatePasswords, wifiQrString } from '@/lib/generators'
import { PasswordStrengthBar } from '@/components/shared/PasswordStrengthBar'
import { TellMeMore } from '@/components/shared/TellMeMore'
import QRCode from 'qrcode'

// ─── QR preview ─────────────────────────────────────────────────────────────

function QRPreview({ ssid, password }: { ssid: string; password: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, wifiQrString(ssid, password), {
      width: 128, margin: 2, color: { dark: '#064e3b', light: '#ffffff' },
    })
  }, [ssid, password])
  return (
    <div className="flex flex-col items-center gap-1">
      <canvas ref={canvasRef} className="rounded-lg border border-gray-200" />
      <p className="text-xs font-semibold text-gray-700 mt-1">{ssid}</p>
    </div>
  )
}

// ─── Accordion section ───────────────────────────────────────────────────────

type SectionState = 'pending' | 'done' | 'skipped'
type Priority = 'required' | 'recommended' | 'optional'

const PRIORITY_BADGE: Record<Priority, { label: string; cls: string }> = {
  required:    { label: 'Required',    cls: 'bg-red-100 text-red-700' },
  recommended: { label: 'Recommended', cls: 'bg-amber-100 text-amber-700' },
  optional:    { label: 'Optional',    cls: 'bg-gray-100 text-gray-500' },
}

function Section({
  icon, title, description, state, priority, isOpen, onToggle, children,
}: {
  icon: string; title: string; description: string;
  state: SectionState; priority: Priority;
  isOpen: boolean; onToggle: () => void; children: React.ReactNode
}) {
  const badge = PRIORITY_BADGE[priority]
  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${
      state === 'done' ? 'border-emerald-400' : isOpen ? 'border-blue-300' : 'border-gray-200'
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {state === 'done' && <span className="text-emerald-500 font-bold">✓</span>}
          {state === 'skipped' && <span className="text-xs text-gray-400">Skipped</span>}
          {state === 'pending' && (
            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badge.cls}`}>
              {badge.label}
            </span>
          )}
          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-5 pt-1 border-t border-gray-100 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Step list (router-specific instructions) ────────────────────────────────

function Steps({ steps }: { steps: string[] }) {
  return (
    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: s }} />
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Done checkbox ───────────────────────────────────────────────────────────

function DoneToggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
        }`}
      >
        {checked && '✓'}
      </button>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ConfigurePage() {
  const router = useRouter()
  const store = useWizardStore()
  const routerInfo = store.routerId ? getRouterById(store.routerId) : null

  const [open, setOpen] = useState<string | null>('wifi')
  const [guestSkipped, setGuestSkipped] = useState(false)
  const [ssidBase, setSsidBase] = useState('')
  const [ssidVariants, setSsidVariants] = useState<string[]>([])
  const [wifiPwSuggestions, setWifiPwSuggestions] = useState<string[]>([])
  const [guestPwSuggestions, setGuestPwSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!store.routerId && !store.provider) router.replace('/')
  }, [store.routerId, store.provider, router])

  function toggle(id: string) {
    setOpen((prev) => (prev === id ? null : id))
  }

  // Router-specific paths (fall back to generic)
  const adminPath   = routerInfo?.adminPasswordPath ?? ['Management', 'Admin Password']
  const wifiPath    = routerInfo?.wifiSettingsPath   ?? ['Wireless', 'WiFi Settings']
  const wpsLoc      = routerInfo?.wpsLocation        ?? 'Advanced → WPS'
  const firmwarePath = routerInfo?.firmwarePath      ?? ['Management', 'Firmware Update']
  const ssidField   = routerInfo?.ssidFieldName      ?? 'Network Name (SSID)'
  const pwField     = routerInfo?.passwordFieldName  ?? 'Password'

  // Section states
  const wifiState: SectionState  = store.ssidName && store.wifiPassword ? 'done' : 'pending'
  const guestState: SectionState = guestSkipped ? 'skipped' : (store.guestName && store.guestPassword ? 'done' : 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => { store.setField('currentModule', 1); router.push('/setup') }}
          className="text-gray-500 hover:text-gray-800 text-xl leading-none"
          aria-label="Go back"
        >←</button>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Configure your router</p>
          {routerInfo && (
            <p className="text-xs text-gray-500">{routerInfo.provider} · {routerInfo.model}</p>
          )}
        </div>
        <button
          onClick={() => router.push('/summary')}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
        >
          Summary →
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">
        <p className="text-xs text-gray-400 px-1">
          Tap any item to configure it. Your progress is saved automatically.
        </p>

        {/* ── 1. Admin Credentials ── */}
        <Section
          icon="🔐"
          title="Admin Password"
          description={store.securityItems['admin-password'] ? 'Changed ✓' : 'Change the router control panel login'}
          state={store.securityItems['admin-password'] ? 'done' : 'pending'}
          priority="recommended"
          isOpen={open === 'admin'}
          onToggle={() => toggle('admin')}
        >
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            ⚠️ The default admin password is printed on the router label — anyone on your WiFi could use it.
            Change it to something only you know.
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Default username</p>
            <code className="block bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700">
              {routerInfo?.defaultUsername ?? 'admin'}
            </code>
            <p className="text-xs text-gray-400 mt-1">Most routers only let you change the password, not the username.</p>
          </div>

          <Steps steps={[
            `Go to <strong>${adminPath.join(' → ')}</strong>`,
            'Enter a new password — make it different from your WiFi password',
            'Click <strong>Save</strong> and write the new password down somewhere safe',
          ]} />

          <DoneToggle
            checked={store.securityItems['admin-password']}
            onToggle={() => store.toggleSecurity('admin-password')}
            label="I've changed the admin password"
          />
        </Section>

        {/* ── 2. WiFi Settings ── */}
        <Section
          icon="📶"
          title="WiFi Settings"
          description={store.ssidName ? `${store.ssidName}` : 'Set your WiFi name and password'}
          state={wifiState}
          priority="required"
          isOpen={open === 'wifi'}
          onToggle={() => toggle('wifi')}
        >
          {/* SSID */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">WiFi Name (SSID)</p>
            <TellMeMore>
              Don't use your address or full name. A neutral name like "BlueOcean_WiFi" reveals nothing about you or your router model. Changing it also disconnects and reconnects all your devices — your password stays the same.
            </TellMeMore>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ssidBase}
                  onChange={(e) => setSsidBase(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ssidBase.trim() && setSsidVariants(generateSSIDVariants(ssidBase))}
                  placeholder="Type a word to get name ideas…"
                  maxLength={20}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={() => ssidBase.trim() && setSsidVariants(generateSSIDVariants(ssidBase))}
                  disabled={!ssidBase.trim()}
                  className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  Generate
                </button>
              </div>
              {ssidVariants.length > 0 && (
                <div className="space-y-1">
                  {ssidVariants.map((v) => (
                    <button
                      key={v}
                      onClick={() => store.setField('ssidName', v)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                        store.ssidName === v
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      <span>{v}</span>
                      {store.ssidName === v && <span className="text-emerald-500 text-xs">✓ Selected</span>}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={store.ssidName}
                onChange={(e) => store.setField('ssidName', e.target.value)}
                placeholder="Or type your own WiFi name"
                maxLength={32}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <p className="text-xs text-gray-400 text-right">{store.ssidName.length}/32</p>
            </div>
          </div>

          {/* Password */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">WiFi Password</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={store.wifiPassword}
                onChange={(e) => store.setField('wifiPassword', e.target.value)}
                placeholder="WiFi password"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
              />
              <button
                onClick={() => { const p = generatePasswords(); setWifiPwSuggestions(p); store.setField('wifiPassword', p[0]) }}
                className="text-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                🎲 Generate
              </button>
            </div>
            {wifiPwSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {wifiPwSuggestions.map((pw) => (
                  <button
                    key={pw}
                    onClick={() => store.setField('wifiPassword', pw)}
                    className={`text-xs px-2 py-1 rounded border font-mono transition-all ${
                      store.wifiPassword === pw
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    {pw}
                  </button>
                ))}
              </div>
            )}
            <PasswordStrengthBar password={store.wifiPassword} />
          </div>

          {/* 2.4 / 5 GHz info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">About 2.4 GHz and 5 GHz</p>
            <p>Modern routers broadcast two bands. <strong>5 GHz</strong> is faster (phones, laptops nearby). <strong>2.4 GHz</strong> reaches further (smart home devices). Both usually share the same name and password — no extra setup needed.</p>
            {routerInfo?.wpa3Supported && (
              <p className="mt-1 text-blue-700">💡 Your router supports <strong>WPA3</strong> — enable it in the security settings for maximum protection.</p>
            )}
          </div>

          {/* Hide SSID */}
          <div className="border border-gray-200 rounded-lg p-3">
            <DoneToggle
              checked={store.securityItems['hide-ssid']}
              onToggle={() => store.toggleSecurity('hide-ssid')}
              label="Hide WiFi name (optional)"
            />
            <p className="text-xs text-gray-500 mt-1 ml-9">
              Your network won't appear in the WiFi list. Note: this is not a strong security measure — determined attackers can still find hidden networks.
            </p>
          </div>

          {/* Apply instructions */}
          {store.ssidName && store.wifiPassword && (
            <Steps steps={[
              `Go to <strong>${wifiPath.join(' → ')}</strong>`,
              `Set <strong>${ssidField}</strong> to: <strong class="text-emerald-700">${store.ssidName}</strong>`,
              `Set <strong>${pwField}</strong> to: <strong class="text-emerald-700 font-mono">${store.wifiPassword}</strong>`,
              'Click <strong>Save</strong> — your devices will briefly disconnect, then reconnect with the new name',
            ]} />
          )}

          {/* QR preview */}
          {store.ssidName && store.wifiPassword && (
            <div className="flex justify-center pt-2">
              <QRPreview ssid={store.ssidName} password={store.wifiPassword} />
            </div>
          )}
        </Section>

        {/* ── 3. Guest WiFi ── */}
        <Section
          icon="👥"
          title="Guest WiFi"
          description={store.guestName ? store.guestName : 'Separate network for visitors (recommended)'}
          state={guestState}
          priority="optional"
          isOpen={open === 'guest'}
          onToggle={() => toggle('guest')}
        >
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Visitors get internet access without being on your main network — so your phones, laptops, and banking apps stay private.
            <TellMeMore>
              A guest network isolates visitors completely. Even if a visitor's device has malware, it can't reach anything on your home network. It's also useful for smart home devices (smart speakers, cameras) which often have weaker security.
            </TellMeMore>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Guest network name</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={store.guestName}
                onChange={(e) => store.setField('guestName', e.target.value)}
                placeholder='e.g. "Smith_Guests"'
                maxLength={32}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              {store.ssidName && !store.guestName && (
                <button
                  onClick={() => store.setField('guestName', `${store.ssidName}_Guests`)}
                  className="text-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Suggest
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Guest password</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={store.guestPassword}
                onChange={(e) => store.setField('guestPassword', e.target.value)}
                placeholder="Guest WiFi password"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
              />
              <button
                onClick={() => { const p = generatePasswords(); setGuestPwSuggestions(p); store.setField('guestPassword', p[0]) }}
                className="text-xs px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                🎲 Generate
              </button>
            </div>
            {guestPwSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {guestPwSuggestions.map((pw) => (
                  <button
                    key={pw}
                    onClick={() => store.setField('guestPassword', pw)}
                    className={`text-xs px-2 py-1 rounded border font-mono transition-all ${
                      store.guestPassword === pw
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    {pw}
                  </button>
                ))}
              </div>
            )}
            <PasswordStrengthBar password={store.guestPassword} />
          </div>

          {store.guestName && store.guestPassword && (
            <>
              <Steps steps={[
                `Go to <strong>${wifiPath.join(' → ')}</strong> → <strong>Guest Network</strong>`,
                'Enable the Guest Network option',
                `Name: <strong class="text-emerald-700">${store.guestName}</strong> · Password: <strong class="text-emerald-700 font-mono">${store.guestPassword}</strong>`,
                'Click <strong>Save</strong>',
              ]} />
              <div className="flex justify-center pt-2">
                <QRPreview ssid={store.guestName} password={store.guestPassword} />
              </div>
            </>
          )}

          <button
            onClick={() => { setGuestSkipped(true); toggle('guest') }}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 rounded-lg"
          >
            Skip — I don't need a guest network
          </button>
        </Section>

        {/* ── 4. WPS ── */}
        <Section
          icon="🔴"
          title="Disable WPS"
          description={store.securityItems['disable-wps'] ? 'Disabled ✓' : 'Turn off the quick-connect button — known security weakness'}
          state={store.securityItems['disable-wps'] ? 'done' : 'pending'}
          priority="recommended"
          isOpen={open === 'wps'}
          onToggle={() => toggle('wps')}
        >
          <TellMeMore>
            WPS (WiFi Protected Setup) lets devices connect by pressing a physical button. It has a known vulnerability that lets attackers crack your WiFi password in hours. Disabling it costs nothing and removes a real risk.
          </TellMeMore>
          <Steps steps={[
            `Go to <strong>${wpsLoc}</strong>`,
            'Set WPS to <strong>Disabled</strong>',
            'Click <strong>Save</strong>',
          ]} />
          <DoneToggle
            checked={store.securityItems['disable-wps']}
            onToggle={() => store.toggleSecurity('disable-wps')}
            label="WPS is disabled"
          />
        </Section>

        {/* ── 5. Firewall ── */}
        <Section
          icon="🛡️"
          title="Firewall"
          description={store.securityItems['enable-firewall'] ? 'Enabled ✓' : 'Verify firewall is on — blocks unwanted internet traffic'}
          state={store.securityItems['enable-firewall'] ? 'done' : 'pending'}
          priority="recommended"
          isOpen={open === 'firewall'}
          onToggle={() => toggle('firewall')}
        >
          <TellMeMore>
            A firewall checks all traffic coming in from the internet and blocks anything suspicious. Most routers have it on by default — this is just a quick confirmation.
          </TellMeMore>
          <Steps steps={[
            'Find <strong>Firewall</strong> or <strong>Security</strong> in the router control panel',
            'Confirm it is set to <strong>Enabled</strong>',
          ]} />
          <DoneToggle
            checked={store.securityItems['enable-firewall']}
            onToggle={() => store.toggleSecurity('enable-firewall')}
            label="Firewall is enabled"
          />
        </Section>

        {/* ── 6. Firmware ── */}
        <Section
          icon="🔄"
          title="Firmware Update"
          description={store.securityItems['firmware-update'] ? 'Up to date ✓' : 'Check for router software updates — fixes security holes'}
          state={store.securityItems['firmware-update'] ? 'done' : 'pending'}
          priority="recommended"
          isOpen={open === 'firmware'}
          onToggle={() => toggle('firmware')}
        >
          <TellMeMore>
            Router manufacturers regularly release updates (firmware) that fix security problems. An outdated router can have known vulnerabilities. Some routers update automatically — this is a one-time check.
          </TellMeMore>
          <Steps steps={[
            `Go to <strong>${firmwarePath.join(' → ')}</strong>`,
            'Click <strong>Check for Updates</strong> — the router may restart briefly',
          ]} />
          <DoneToggle
            checked={store.securityItems['firmware-update']}
            onToggle={() => store.toggleSecurity('firmware-update')}
            label="Firmware is up to date"
          />
        </Section>

        {/* ── Go to Summary ── */}
        <div className="pt-2">
          <button
            onClick={() => router.push('/summary')}
            className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 transition-colors"
          >
            View Summary →
          </button>
          {!store.ssidName && (
            <p className="text-center text-xs text-amber-600 mt-2">
              Complete WiFi Settings first to get your QR code
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Your progress is saved in this browser — come back anytime.
        </p>
      </div>
    </div>
  )
}
