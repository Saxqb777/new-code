'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MarkAllRead() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function markAll() {
    setLoading(true)
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={markAll}
      disabled={loading}
      className="text-sm text-brand-600 hover:underline disabled:opacity-60"
    >
      {loading ? 'Marking…' : 'Mark all read'}
    </button>
  )
}
