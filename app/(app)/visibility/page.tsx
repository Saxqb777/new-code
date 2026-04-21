import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { isOverdue, projectStatusLabel, projectRoleLabel } from '@/lib/utils'
import type { VisibilityProjectSummary, VisibilityTeamMember, VisibilityAlert } from '@/types'
import PipelineBoard from '@/components/visibility/PipelineBoard'
import TeamWorkloadTable from '@/components/visibility/TeamWorkloadTable'
import BottleneckAlerts from '@/components/visibility/BottleneckAlerts'

const ACTIVE_STATUSES = ['DRAFT', 'IN_PRODUCTION', 'IN_POST', 'IN_REVIEW', 'APPROVED']

export default async function VisibilityPage() {
  const session = await requireAuth()
  const userId = session.user.id
  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'

  const userMemberships = await prisma.projectMember.findMany({
    where: { userId, removedAt: null },
    select: { projectId: true, role: true },
  })
  const roles = userMemberships.map(m => m.role as string)
  const isClient = roles.includes('CLIENT') && !isAdmin
  const isPM = roles.includes('PROJECT_MANAGER')

  if (!isAdmin && !isPM && !isClient) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-slate-500">
        Visibility dashboard is available to admins, project managers, and clients.
      </div>
    )
  }

  const projectFilter = isAdmin || isPM
    ? { status: { in: ACTIVE_STATUSES as any }, deletedAt: null }
    : {
        status: { in: ACTIVE_STATUSES as any },
        deletedAt: null,
        members: { some: { userId, removedAt: null, role: 'CLIENT' } },
      }

  const projects = await prisma.project.findMany({
    where: projectFilter,
    include: {
      members: {
        where: { removedAt: null },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
      milestones: true,
      assets: { select: { createdAt: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      reviews: { where: { status: 'PENDING' }, select: { requestedAt: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Build pipeline summaries
  const summaries: VisibilityProjectSummary[] = projects.map(p => ({
    id: p.id,
    title: p.title,
    clientName: p.clientName,
    status: p.status,
    dueDate: p.dueDate?.toISOString() ?? null,
    members: p.members.map(m => ({
      userId: m.userId,
      name: m.user.name,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
    })),
    milestoneCount: p.milestones.length,
    completedMilestoneCount: p.milestones.filter(m => m.status === 'COMPLETED').length,
    isOverdue: !!p.dueDate && isOverdue(p.dueDate),
  }))

  // Team workload (admin/PM only)
  let teamMembers: VisibilityTeamMember[] = []
  if (isAdmin || isPM) {
    const allMembers = projects.flatMap(p =>
      p.members.map(m => ({
        userId: m.userId,
        name: m.user.name,
        avatarUrl: m.user.avatarUrl,
        projectId: p.id,
        projectTitle: p.title,
        role: m.role,
        status: p.status,
        dueDate: p.dueDate?.toISOString() ?? null,
        isOverdue: !!p.dueDate && isOverdue(p.dueDate),
      }))
    )
    const byUser = new Map<string, VisibilityTeamMember>()
    for (const m of allMembers) {
      if (!byUser.has(m.userId)) {
        byUser.set(m.userId, { userId: m.userId, name: m.name, avatarUrl: m.avatarUrl, assignments: [] })
      }
      byUser.get(m.userId)!.assignments.push({
        projectId: m.projectId,
        projectTitle: m.projectTitle,
        role: m.role,
        status: m.status,
        dueDate: m.dueDate,
        isOverdue: m.isOverdue,
      })
    }
    teamMembers = Array.from(byUser.values())
  }

  // Alerts
  const alerts: VisibilityAlert[] = []
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const threeDays = 3 * 24 * 60 * 60 * 1000

  for (const p of projects) {
    // Stalled in production with no recent asset upload
    if (p.status === 'IN_PRODUCTION' || p.status === 'IN_POST') {
      const lastAsset = p.assets[0]
      const stalled = !lastAsset || now - lastAsset.createdAt.getTime() > sevenDays
      if (stalled) {
        alerts.push({
          type: 'stalled',
          projectId: p.id,
          projectTitle: p.title,
          message: `No upload activity in over 7 days`,
          severity: 'warning',
        })
      }
    }

    // Review pending > 3 days
    for (const r of p.reviews) {
      if (now - r.requestedAt.getTime() > threeDays) {
        alerts.push({
          type: 'review_pending',
          projectId: p.id,
          projectTitle: p.title,
          message: `Review has been pending for ${Math.floor((now - r.requestedAt.getTime()) / (24 * 60 * 60 * 1000))} days`,
          severity: 'critical',
        })
      }
    }

    // Overdue milestones
    const overdueMilestones = p.milestones.filter(
      m => m.dueDate && isOverdue(m.dueDate) && m.status !== 'COMPLETED'
    )
    if (overdueMilestones.length > 0) {
      alerts.push({
        type: 'milestone_overdue',
        projectId: p.id,
        projectTitle: p.title,
        message: `${overdueMilestones.length} milestone${overdueMilestones.length > 1 ? 's' : ''} past due`,
        severity: overdueMilestones.length > 2 ? 'critical' : 'warning',
      })
    }

    // Unassigned shooter or editor
    const hasShooter = p.members.some(m => m.role === 'SHOOTER')
    const hasEditor = p.members.some(m => m.role === 'EDITOR')
    if (!hasShooter) {
      alerts.push({ type: 'unassigned_role', projectId: p.id, projectTitle: p.title, message: 'No shooter assigned', severity: 'warning' })
    }
    if (!hasEditor) {
      alerts.push({ type: 'unassigned_role', projectId: p.id, projectTitle: p.title, message: 'No editor assigned', severity: 'warning' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visibility</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {projects.length} active project{projects.length !== 1 ? 's' : ''}
            {alerts.length > 0 && ` · ${alerts.length} alert${alerts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PipelineBoard projects={summaries} />
          {(isAdmin || isPM) && <TeamWorkloadTable members={teamMembers} />}
        </div>
        <div>
          <BottleneckAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  )
}
