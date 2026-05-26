export type Provider = 'Eir' | 'Virgin Media' | 'Sky' | 'Vodafone' | 'Other'

export type RouterInfo = {
  id: string
  provider: Provider
  model: string
  adminUrl: string
  defaultUsername: string
  defaultPasswordHint: string
  labelLocation: 'bottom' | 'back' | 'side'
  wifiSettingsPath: string[]
  guestNetworkSupported: boolean
  wpa3Supported: boolean
  wpsSupported: boolean
  wpsLocation: string
  firmwarePath: string[]
  adminPasswordPath: string[]
  ssidFieldName: string
  passwordFieldName: string
}

export const ROUTERS: RouterInfo[] = [
  {
    id: 'eir-f3000',
    provider: 'Eir',
    model: 'F3000',
    adminUrl: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the bottom of the router',
    labelLocation: 'bottom',
    wifiSettingsPath: ['Wireless', 'WiFi Settings'],
    guestNetworkSupported: true,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'Advanced → WPS',
    firmwarePath: ['Management', 'Firmware Update'],
    adminPasswordPath: ['Management', 'Access Control'],
    ssidFieldName: 'Network Name (SSID)',
    passwordFieldName: 'Password / Passphrase',
  },
  {
    id: 'eir-smart-hub',
    provider: 'Eir',
    model: 'Smart Hub',
    adminUrl: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the bottom of the router',
    labelLocation: 'bottom',
    wifiSettingsPath: ['WiFi', 'WiFi Setup'],
    guestNetworkSupported: true,
    wpa3Supported: true,
    wpsSupported: true,
    wpsLocation: 'WiFi → WPS',
    firmwarePath: ['Advanced', 'Software Update'],
    adminPasswordPath: ['Advanced', 'Admin Password'],
    ssidFieldName: 'WiFi Name',
    passwordFieldName: 'WiFi Password',
  },
  {
    id: 'virgin-hub4',
    provider: 'Virgin Media',
    model: 'Hub 4',
    adminUrl: '192.168.0.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the back of the router',
    labelLocation: 'back',
    wifiSettingsPath: ['WiFi', 'WiFi Settings'],
    guestNetworkSupported: true,
    wpa3Supported: true,
    wpsSupported: true,
    wpsLocation: 'WiFi → WPS Settings',
    firmwarePath: ['Advanced Settings', 'Firmware'],
    adminPasswordPath: ['Advanced Settings', 'Admin Password'],
    ssidFieldName: 'Network Name (SSID)',
    passwordFieldName: 'Network Key',
  },
  {
    id: 'virgin-hub3',
    provider: 'Virgin Media',
    model: 'Hub 3',
    adminUrl: '192.168.0.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the back of the router',
    labelLocation: 'back',
    wifiSettingsPath: ['WiFi', 'WiFi Settings'],
    guestNetworkSupported: false,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'WiFi → WPS',
    firmwarePath: ['Advanced Settings', 'Firmware'],
    adminPasswordPath: ['Advanced Settings', 'Admin Password'],
    ssidFieldName: 'Network Name (SSID)',
    passwordFieldName: 'Network Key',
  },
  {
    id: 'sky-q-hub',
    provider: 'Sky',
    model: 'Sky Q Hub',
    adminUrl: '192.168.0.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the back of the router',
    labelLocation: 'back',
    wifiSettingsPath: ['WiFi settings'],
    guestNetworkSupported: false,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'WiFi settings → WPS',
    firmwarePath: ['Advanced', 'Firmware update'],
    adminPasswordPath: ['Advanced', 'Management password'],
    ssidFieldName: 'Network Name',
    passwordFieldName: 'Password',
  },
  {
    id: 'sky-hub',
    provider: 'Sky',
    model: 'Sky Hub',
    adminUrl: '192.168.0.1',
    defaultUsername: 'admin',
    defaultPasswordHint: 'printed on the label on the back of the router',
    labelLocation: 'back',
    wifiSettingsPath: ['Wireless'],
    guestNetworkSupported: false,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'Wireless → WPS',
    firmwarePath: ['Maintenance', 'Upgrade Firmware'],
    adminPasswordPath: ['Maintenance', 'Admin Password'],
    ssidFieldName: 'SSID',
    passwordFieldName: 'Security Key',
  },
  {
    id: 'vodafone-gigabox',
    provider: 'Vodafone',
    model: 'Gigabox',
    adminUrl: '192.168.1.1',
    defaultUsername: 'vodafone',
    defaultPasswordHint: 'printed on the label on the bottom of the router',
    labelLocation: 'bottom',
    wifiSettingsPath: ['WiFi', 'Basic Settings'],
    guestNetworkSupported: true,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'WiFi → WPS',
    firmwarePath: ['Administration', 'Firmware Upgrade'],
    adminPasswordPath: ['Administration', 'Admin Password'],
    ssidFieldName: 'Network Name (SSID)',
    passwordFieldName: 'WiFi Password',
  },
  {
    id: 'vodafone-hg659b',
    provider: 'Vodafone',
    model: 'HG659b',
    adminUrl: '192.168.1.1',
    defaultUsername: 'vodafone',
    defaultPasswordHint: 'printed on the label on the back of the router',
    labelLocation: 'back',
    wifiSettingsPath: ['WiFi', 'Basic'],
    guestNetworkSupported: false,
    wpa3Supported: false,
    wpsSupported: true,
    wpsLocation: 'WiFi → WPS',
    firmwarePath: ['Management', 'Software Upgrade'],
    adminPasswordPath: ['Management', 'Account'],
    ssidFieldName: 'SSID',
    passwordFieldName: 'Password',
  },
]

export const PROVIDERS: Provider[] = ['Eir', 'Virgin Media', 'Sky', 'Vodafone', 'Other']

export function getRoutersByProvider(provider: Provider): RouterInfo[] {
  return ROUTERS.filter((r) => r.provider === provider)
}

export function getRouterById(id: string): RouterInfo | undefined {
  return ROUTERS.find((r) => r.id === id)
}
