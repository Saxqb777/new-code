import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  clientName: z.string().optional(),
  dueDate: z.string().nullable().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const where = isAdmin
    ? { deletedAt: null }
    : { deletedAt: null, members: { some: { userId: session.user.id, removedAt: null } } }

  const projects = await prisma.project.findMany({ where, orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { title, description, clientName, dueDate } = parsed.data

  const project = await prisma.$transaction(async tx => {
    const p = await tx.project.create({
      data: {
        title,
        description,
        clientName,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })
    await tx.projectMember.create({
      data: { projectId: p.id, userId: session.user.id, role: 'PROJECT_MANAGER' },
    })
    await tx.auditLog.create({
      data: { actorId: session.user.id, action: 'project.created', entityType: 'Project', entityId: p.id, projectId: p.id },
    })
    return p
  })

  revalidatePath('/projects')
  return NextResponse.json(project, { status: 201 })
}
