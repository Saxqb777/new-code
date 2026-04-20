import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const members = await prisma.projectMember.findMany({
    where: { projectId: params.projectId, removedAt: null },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  return NextResponse.json(members)
}
