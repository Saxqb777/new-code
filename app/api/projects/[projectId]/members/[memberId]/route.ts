import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

export async function DELETE(req: Request, { params }: { params: { projectId: string; memberId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const isPM = await prisma.projectMember.findFirst({
    where: { projectId: params.projectId, userId: session.user.id, role: 'PROJECT_MANAGER', removedAt: null },
  })
  if (!isAdmin && !isPM) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.projectMember.update({
    where: { id: params.memberId },
    data: { removedAt: new Date() },
  })
  return NextResponse.json({ ok: true })
}
