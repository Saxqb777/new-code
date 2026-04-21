import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  clientName: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.enum(['DRAFT','IN_PRODUCTION','IN_POST','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED']).optional(),
})

async function getProjectAndRoles(projectId: string, userId: string, globalRole: string) {
  const project = await prisma.project.findFirst({ where: { id: projectId, deletedAt: null } })
  if (!project) return { project: null, roles: [] }
  if (globalRole === 'AGENCY_ADMIN') return { project, roles: ['PROJECT_MANAGER'] }
  const members = await prisma.projectMember.findMany({ where: { projectId, userId, removedAt: null } })
  return { project, roles: members.map(m => m.role as string) }
}

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { project, roles } = await getProjectAndRoles(params.projectId, session.user.id, session.user.globalRole)
  if (!project || (!roles.length && session.user.globalRole !== 'AGENCY_ADMIN')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(project)
}

export async function PATCH(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { project, roles } = await getProjectAndRoles(params.projectId, session.user.id, session.user.globalRole)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!roles.includes('PROJECT_MANAGER')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const updated = await prisma.project.update({
    where: { id: params.projectId },
    data: { ...parsed.data, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined },
  })
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: 'project.updated', entityType: 'Project', entityId: params.projectId, projectId: params.projectId, after: parsed.data as any },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.globalRole !== 'AGENCY_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.project.update({ where: { id: params.projectId }, data: { deletedAt: new Date() } })
  return NextResponse.json({ ok: true })
}
