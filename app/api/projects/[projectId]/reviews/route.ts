import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const reviews = await prisma.review.findMany({
    where: { projectId: params.projectId },
    orderBy: { requestedAt: 'desc' },
  })
  return NextResponse.json(reviews)
}
