import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="text-6xl mb-6">📶</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Set up your home WiFi
        </h1>
        <p className="text-lg text-gray-500 max-w-sm mb-2">
          A simple step-by-step guide to configure and secure your router —
          no technical knowledge needed.
        </p>
        <p className="text-sm text-gray-400 mb-8">Takes about 10 minutes</p>

        <Link
          href="/setup"
          className="px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
        >
          Start Setup →
        </Link>

        <div className="mt-16 w-full max-w-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">What we cover</p>
          <div className="space-y-3 text-left">
            {[
              { icon: '🔍', title: 'Identify your router', desc: 'Eir, Virgin Media, Sky, Vodafone' },
              { icon: '🌐', title: 'Access your settings', desc: 'Open the control panel safely' },
              { icon: '📛', title: 'Name your WiFi', desc: 'Pick a good name with our generator' },
              { icon: '🔒', title: 'Set a strong password', desc: 'With strength checker & suggestions' },
              { icon: '🛡️', title: 'Secure your network', desc: 'Guest network, firewall, WPS & more' },
              { icon: '📱', title: 'Get a QR code', desc: 'Share WiFi with visitors instantly' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-400 max-w-xs">
          Your data never leaves your browser. Nothing is stored on any server.
        </p>
      </main>
    </div>
  )
}
