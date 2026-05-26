'use client'

import { useState } from 'react'

type Props = {
  children: React.ReactNode
}

export function TellMeMore({ children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-emerald-700 underline underline-offset-2 hover:text-emerald-900 transition-colors"
      >
        {open ? '▲ Show less' : '💡 Tell me more'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}
