'use client'

import { useState } from 'react'
import { Plus, RefreshCw, ExternalLink } from 'lucide-react'
import { detectSocialPlatform, formatDate } from '@/lib/utils'

type Platform = 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK'

interface AnalyticsItem {
  id: string
  platform: Platform
  externalUrl: string
  publishedAt: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  lastFetchedAt: string | null
}

interface Props {
  projectId: string
  canManage: boolean
  analytics: AnalyticsItem[]
}

const platformConfig: Record<Platform, { label: string; color: string; emoji: string }> = {
  YOUTUBE:   { label: 'YouTube',   color: 'bg-red-100 text-red-700',    emoji: '▶️' },
  INSTAGRAM: { label: 'Instagram', color: 'bg-pink-100 text-pink-700',  emoji: '📸' },
  TIKTOK:    { label: 'TikTok',    color: 'bg-slate-100 text-slate-700', emoji: '🎵' },
}

export default function AnalyticsPanel({ projectId, canManage, analytics: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [url, setUrl] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function addLink() {
    if (!url.trim()) return
    const platform = detectSocialPlatform(url)
    if (!platform) { setError('Paste a YouTube, Instagram, or TikTok URL.'); return }
    setAdding(true)
    setError('')
    const res = await fetch(`/api/projects/${projectId}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) {
      const item = await res.json()
      setItems(prev => [...prev, item])
      setUrl('')
      setShowForm(false)
    } else {
      const d = await res.json()
      setError(d.error ?? 'Failed to add link.')
    }
    setAdding(false)
  }

  async function refresh(id: string) {
    setRefreshing(id)
    const res = await fetch(`/api/projects/${projectId}/analytics/${id}/refresh`, { method: 'POST' })
    if (res.ok) {
      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === id ? updated : i))
    }
    setRefreshing(null)
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Link published video
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Link a published video</h3>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=…"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={addLink}
              disabled={adding}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-slate-900">No analytics yet</h3>
          <p className="text-slate-500 text-sm mt-1">
            {canManage ? 'Link a published video to track performance.' : 'Analytics will appear here once videos are published.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const pc = platformConfig[item.platform]
            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${pc.color}`}>
                      {pc.emoji} {pc.label}
                    </span>
                    <a href={item.externalUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                      View <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.lastFetchedAt && (
                      <span className="text-xs text-slate-400">Updated {formatDate(item.lastFetchedAt)}</span>
                    )}
                    <button
                      onClick={() => refresh(item.id)}
                      disabled={refreshing === item.id}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                      title="Refresh metrics"
                    >
                      <RefreshCw size={15} className={refreshing === item.id ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <Metric label="Views"    value={item.viewCount}    />
                  <Metric label="Likes"    value={item.likeCount}    />
                  <Metric label="Comments" value={item.commentCount} />
                  <Metric label="Shares"   value={item.shareCount}   />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <div className="text-xl font-bold text-slate-900">{value.toLocaleString()}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
