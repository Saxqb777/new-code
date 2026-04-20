'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'

interface Milestone {
  id: string
  title: string
  description: string | null
  status: MilestoneStatus
  dueDate: string | null
  assignee: { id: string; name: string } | null
}

interface Member { id: string; name: string }

interface Props {
  projectId: string
  milestones: Milestone[]
  members: Member[]
  canEdit: boolean
}

const COLUMNS: { status: MilestoneStatus; label: string; color: string }[] = [
  { status: 'PENDING',     label: 'To Do',       color: 'bg-slate-100 text-slate-600' },
  { status: 'IN_PROGRESS', label: 'In Progress',  color: 'bg-amber-100 text-amber-700' },
  { status: 'COMPLETED',   label: 'Completed',    color: 'bg-emerald-100 text-emerald-700' },
  { status: 'BLOCKED',     label: 'Blocked',      color: 'bg-red-100 text-red-700' },
]

export default function MilestoneBoard({ projectId, milestones: initial, members, canEdit }: Props) {
  const [milestones, setMilestones] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assigneeId: '' })
  const [saving, setSaving] = useState(false)

  async function createMilestone() {
    setSaving(true)
    const res = await fetch(`/api/projects/${projectId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const m = await res.json()
      setMilestones(prev => [...prev, m])
      setForm({ title: '', description: '', dueDate: '', assigneeId: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: MilestoneStatus) {
    const res = await fetch(`/api/projects/${projectId}/milestones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    }
  }

  async function deleteMilestone(id: string) {
    if (!confirm('Delete this milestone?')) return
    const res = await fetch(`/api/projects/${projectId}/milestones/${id}`, { method: 'DELETE' })
    if (res.ok) setMilestones(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add milestone
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">New milestone</h3>
          <div className="space-y-3">
            <input
              placeholder="Title *"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <textarea
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <div className="flex gap-3">
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={form.assigneeId}
                onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createMilestone}
                disabled={saving || !form.title}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map(col => {
          const items = milestones.filter(m => m.status === col.status)
          return (
            <div key={col.status} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.color}`}>{col.label}</span>
                <span className="text-xs text-slate-400">{items.length}</span>
              </div>
              <div className="p-3 space-y-2 min-h-24">
                {items.map(m => (
                  <div key={m.id} className="bg-slate-50 rounded-lg p-3 group relative">
                    <div className="text-sm font-medium text-slate-900 pr-6">{m.title}</div>
                    {m.assignee && (
                      <div className="text-xs text-slate-500 mt-0.5">{m.assignee.name}</div>
                    )}
                    {m.dueDate && (
                      <div className="text-xs text-slate-400 mt-1">{formatDate(m.dueDate)}</div>
                    )}
                    {canEdit && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        {col.status !== 'COMPLETED' && (
                          <button
                            onClick={() => updateStatus(m.id, 'COMPLETED')}
                            className="text-emerald-500 hover:text-emerald-700"
                            title="Mark complete"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMilestone(m.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {canEdit && col.status !== 'COMPLETED' && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {COLUMNS.filter(c => c.status !== col.status && c.status !== 'COMPLETED').map(c => (
                          <button
                            key={c.status}
                            onClick={() => updateStatus(m.id, c.status)}
                            className={`text-xs px-1.5 py-0.5 rounded ${c.color} opacity-60 hover:opacity-100 transition-opacity`}
                          >
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
