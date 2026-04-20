import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export function formatBytes(bytes: number | bigint): string {
  const n = typeof bytes === 'bigint' ? Number(bytes) : bytes
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function formatDuration(ms: number | null): string {
  if (!ms) return '—'
  const secs = Math.floor(ms / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function daysUntil(date: Date | string | null): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false
  return new Date(date).getTime() < Date.now()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function projectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    IN_PRODUCTION: 'Shooting',
    IN_POST: 'Editing',
    IN_REVIEW: 'In Review',
    APPROVED: 'Approved',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  }
  return labels[status] ?? status
}

export function projectRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    PROJECT_MANAGER: 'Project Manager',
    SHOOTER: 'Shooter',
    EDITOR: 'Editor',
    CLIENT: 'Client',
  }
  return labels[role] ?? role
}

export function detectSocialPlatform(url: string): 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YOUTUBE'
  if (url.includes('instagram.com')) return 'INSTAGRAM'
  if (url.includes('tiktok.com')) return 'TIKTOK'
  return null
}
