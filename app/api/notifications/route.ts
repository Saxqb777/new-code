import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const limit = parseInt(url.searchParams.get('limit') ?? '50')

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 100),
  })

  const unread = await prisma.notification.count({
    where: { userId: session.user.id, readAt: null },
  })

  return NextResponse.json({ notifications, unread })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  if (body.all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: new Date() },
    })
  } else if (Array.isArray(body.ids)) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, id: { in: body.ids } },
      data: { readAt: new Date() },
    })
  }

  return NextResponse.json({ ok: true })
}
