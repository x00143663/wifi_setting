'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WizardState = {
  currentModule: number

  // Step 1 — Router ID
  provider: string | null
  routerId: string | null

  // Configure — WiFi
  ssidName: string
  wifiPassword: string

  // Configure — Guest WiFi
  guestName: string
  guestPassword: string

  // Configure — Security checklist
  securityItems: Record<string, boolean>

  // Actions
  nextModule: () => void
  prevModule: () => void
  setField: <K extends keyof Omit<WizardState, 'nextModule' | 'prevModule' | 'setField' | 'toggleSecurity' | 'reset'>>(
    key: K,
    value: WizardState[K]
  ) => void
  toggleSecurity: (id: string) => void
  reset: () => void
}

const INITIAL_SECURITY: Record<string, boolean> = {
  'admin-password': false,
  'disable-wps': false,
  'enable-firewall': false,
  'firmware-update': false,
  'hide-ssid': false,
}

const initialState = {
  currentModule: 0,
  provider: null as string | null,
  routerId: null as string | null,
  ssidName: '',
  wifiPassword: '',
  guestName: '',
  guestPassword: '',
  securityItems: INITIAL_SECURITY,
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,

      nextModule: () => set((s) => ({ currentModule: s.currentModule + 1 })),
      prevModule: () => set((s) => ({ currentModule: Math.max(0, s.currentModule - 1) })),

      setField: (key, value) => set({ [key]: value } as Partial<WizardState>),

      toggleSecurity: (id) =>
        set((s) => ({
          securityItems: { ...s.securityItems, [id]: !s.securityItems[id] },
        })),

      reset: () => set({ ...initialState, securityItems: { ...INITIAL_SECURITY } }),
    }),
    { name: 'wifi-wizard-v3' }
  )
)
