'use client'

import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'

export default function InviteUserDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [globalRole, setGlobalRole] = useState('USER')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function send() {
    if (!email.trim()) return
    setSending(true)
    setError('')
    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, globalRole }),
    })
    setSending(false)
    if (res.ok) {
      setSent(true)
      setEmail('')
      setTimeout(() => { setSent(false); setOpen(false) }, 2000)
    } else {
      const d = await res.json()
      setError(d.error ?? 'Failed to send invite.')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <UserPlus size={16} /> Invite member
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Invite team member</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {sent ? (
              <div className="text-center py-4 text-emerald-600 font-medium">✅ Invite sent!</div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="colleague@agency.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={globalRole}
                    onChange={e => setGlobalRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="USER">Team member</option>
                    <option value="AGENCY_ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  onClick={send}
                  disabled={sending || !email.trim()}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  {sending ? 'Sending…' : 'Send invite'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
