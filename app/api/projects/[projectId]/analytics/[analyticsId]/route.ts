import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

// On-demand analytics refresh — MVP: just touches lastFetchedAt
// Phase 2: call social API here (youtube.ts, instagram.ts, tiktok.ts)
export async function POST(req: Request, { params }: { params: { projectId: string; analyticsId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const record = await prisma.projectAnalytics.findUnique({ where: { id: params.analyticsId } })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // MVP: placeholder — in Phase 2 call platform APIs here
  const updated = await prisma.projectAnalytics.update({
    where: { id: params.analyticsId },
    data: { lastFetchedAt: new Date() },
  })

  return NextResponse.json({
    ...updated,
    viewCount: Number(updated.viewCount),
    likeCount: Number(updated.likeCount),
    commentCount: Number(updated.commentCount),
    shareCount: Number(updated.shareCount),
    publishedAt: updated.publishedAt?.toISOString() ?? null,
    lastFetchedAt: updated.lastFetchedAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  })
}
