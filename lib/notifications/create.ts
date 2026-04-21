import { prisma } from '@/lib/db/client'
import { broadcast } from '@/lib/notifications/sse'
import type { NotificationType } from '@prisma/client'

export async function createNotification(
  userId: string,
  type: NotificationType,
  payload: { title: string; body: string; linkUrl?: string; extra?: Record<string, unknown> }
) {
  const notif = await prisma.notification.create({
    data: {
      userId,
      type,
      title: payload.title,
      body: payload.body,
      linkUrl: payload.linkUrl,
      payload: payload.extra ?? null,
    },
  })

  broadcast(userId, {
    type: 'notification',
    data: {
      id: notif.id,
      title: notif.title,
      body: notif.body,
      linkUrl: notif.linkUrl,
      notificationType: notif.type,
      createdAt: notif.createdAt.toISOString(),
    },
  })

  const unread = await prisma.notification.count({ where: { userId, readAt: null } })
  broadcast(userId, { type: 'unread_count', data: { count: unread } })

  return notif
}
