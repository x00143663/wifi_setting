'use client'

import { scorePassword } from '@/lib/generators'

type Props = { password: string }

export function PasswordStrengthBar({ password }: Props) {
  if (!password) return null
  const { score, label, color } = scorePassword(password)
  const maxScore = 6
  const pct = Math.round((score / maxScore) * 100)

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Password strength</span>
        <span className={`text-xs font-semibold ${label === 'Strong' ? 'text-green-600' : label === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
          {label}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
