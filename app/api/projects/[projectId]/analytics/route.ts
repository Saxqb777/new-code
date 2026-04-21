import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { detectSocialPlatform } from '@/lib/utils'

const schema = z.object({ url: z.string().url() })

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const analytics = await prisma.projectAnalytics.findMany({
    where: { projectId: params.projectId },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(analytics.map(a => ({
    ...a,
    viewCount: Number(a.viewCount),
    likeCount: Number(a.likeCount),
    commentCount: Number(a.commentCount),
    shareCount: Number(a.shareCount),
    publishedAt: a.publishedAt?.toISOString() ?? null,
    lastFetchedAt: a.lastFetchedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  })))
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

  const platform = detectSocialPlatform(parsed.data.url)
  if (!platform) return NextResponse.json({ error: 'Unsupported platform. Use YouTube, Instagram, or TikTok URLs.' }, { status: 400 })

  // Extract external ID from URL
  let externalId = parsed.data.url
  try {
    const u = new URL(parsed.data.url)
    if (platform === 'YOUTUBE') externalId = u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? parsed.data.url
    if (platform === 'INSTAGRAM') externalId = u.pathname.split('/').filter(Boolean).pop() ?? parsed.data.url
    if (platform === 'TIKTOK') externalId = u.pathname.split('/').pop() ?? parsed.data.url
  } catch {}

  const analytics = await prisma.projectAnalytics.create({
    data: { projectId: params.projectId, platform, externalId, externalUrl: parsed.data.url },
  })

  return NextResponse.json({
    ...analytics,
    viewCount: Number(analytics.viewCount),
    likeCount: Number(analytics.likeCount),
    commentCount: Number(analytics.commentCount),
    shareCount: Number(analytics.shareCount),
    publishedAt: analytics.publishedAt?.toISOString() ?? null,
    lastFetchedAt: analytics.lastFetchedAt?.toISOString() ?? null,
    createdAt: analytics.createdAt.toISOString(),
    updatedAt: analytics.updatedAt.toISOString(),
  }, { status: 201 })
}
