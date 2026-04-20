'use client'

import { useState, useRef } from 'react'
import { MessageSquare, CheckCircle2, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string
  body: string
  startTimeMs: number | null
  resolved: boolean
  authorId: string
  authorName: string
  createdAt: string
}

interface Review {
  id: string
  status: string
  requestedAt: string
  decidedAt: string | null
  notes: string | null
  assetTitle: string
  assetType: string
  videoUrl: string | null
  comments: Comment[]
}

interface Props {
  projectId: string
  userId: string
  isClient: boolean
  isAdmin: boolean
  projectStatus: string
  review: Review | null
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING:           { label: 'Awaiting review', color: 'bg-blue-100 text-blue-700' },
  APPROVED:          { label: 'Approved',         color: 'bg-emerald-100 text-emerald-700' },
  CHANGES_REQUESTED: { label: 'Changes needed',   color: 'bg-amber-100 text-amber-700' },
}

export default function ReviewPanel({ projectId, userId, isClient, isAdmin, projectStatus, review: initial }: Props) {
  const [review, setReview] = useState(initial)
  const [comments, setComments] = useState(initial?.comments ?? [])
  const [commentBody, setCommentBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deciding, setDeciding] = useState(false)
  const [decisionNotes, setDecisionNotes] = useState('')
  const [showDecision, setShowDecision] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!review) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="font-semibold text-slate-900">No review yet</h3>
        <p className="text-slate-500 text-sm mt-1">
          A review will appear here once the editor submits the final cut.
        </p>
      </div>
    )
  }

  const sc = statusConfig[review.status] ?? { label: review.status, color: 'bg-slate-100 text-slate-600' }
  const canDecide = isClient && review.status === 'PENDING'

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentBody.trim()) return
    setSubmitting(true)
    const startTimeMs = videoRef.current ? Math.floor(videoRef.current.currentTime * 1000) : null
    const res = await fetch(`/api/projects/${projectId}/reviews/${review.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: commentBody, startTimeMs }),
    })
    if (res.ok) {
      const c = await res.json()
      setComments(prev => [...prev, c])
      setCommentBody('')
    }
    setSubmitting(false)
  }

  async function decide(decision: 'APPROVED' | 'CHANGES_REQUESTED') {
    setDeciding(true)
    const res = await fetch(`/api/projects/${projectId}/reviews/${review.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: decision, notes: decisionNotes }),
    })
    if (res.ok) {
      const updated = await res.json()
      setReview(updated)
      setShowDecision(false)
    }
    setDeciding(false)
  }

  function seekTo(ms: number) {
    if (videoRef.current) videoRef.current.currentTime = ms / 1000
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{review.assetTitle}</h3>
          <div className="text-sm text-slate-500 mt-0.5">
            Submitted {formatDate(review.requestedAt)}
            {review.decidedAt && ` · Decision: ${formatDate(review.decidedAt)}`}
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
      </div>

      {/* Video player */}
      {review.videoUrl && (
        <div className="bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={review.videoUrl}
            controls
            className="w-full max-h-[500px]"
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Comments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare size={16} /> Comments
          </h3>

          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
            {comments.length === 0 && (
              <p className="text-sm text-slate-400">No comments yet. Click anywhere in the video to add a frame comment.</p>
            )}
            {comments.map(c => (
              <div key={c.id} className={`rounded-lg p-3 ${c.resolved ? 'bg-slate-50 opacity-60' : 'bg-blue-50'}`}>
                {c.startTimeMs !== null && (
                  <button
                    onClick={() => seekTo(c.startTimeMs!)}
                    className="text-xs font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mb-1.5 hover:bg-blue-200 transition-colors"
                  >
                    {formatMs(c.startTimeMs)}
                  </button>
                )}
                <p className="text-sm text-slate-700">{c.body}</p>
                <div className="text-xs text-slate-400 mt-1">{c.authorName} · {formatDate(c.createdAt)}</div>
              </div>
            ))}
          </div>

          <form onSubmit={submitComment} className="space-y-2">
            <textarea
              rows={2}
              placeholder={videoRef.current ? `Comment at ${formatMs(Math.floor((videoRef.current.currentTime || 0) * 1000))}…` : 'Add a comment…'}
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        </div>

        {/* Decision (client only) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Review decision</h3>

          {review.status !== 'PENDING' ? (
            <div className="space-y-3">
              <div className={`rounded-lg px-4 py-3 text-sm font-medium ${sc.color}`}>
                {sc.label}
              </div>
              {review.notes && <p className="text-sm text-slate-600">{review.notes}</p>}
            </div>
          ) : canDecide ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Review the video and leave comments, then approve or request changes.
              </p>
              {!showDecision ? (
                <button
                  onClick={() => setShowDecision(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Make a decision
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Add notes (optional)…"
                    value={decisionNotes}
                    onChange={e => setDecisionNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide('CHANGES_REQUESTED')}
                      disabled={deciding}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      <XCircle size={16} /> Request changes
                    </button>
                    <button
                      onClick={() => decide('APPROVED')}
                      disabled={deciding}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              {isClient ? 'This review is already decided.' : 'Only the client can approve or request changes.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}
