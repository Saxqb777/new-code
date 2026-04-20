import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { subscribe, unsubscribe } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const userId = session.user.id

  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController

  const stream = new ReadableStream({
    async start(c) {
      controller = c

      // Send initial unread count
      const unread = await prisma.notification.count({ where: { userId, readAt: null } })
      c.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'unread_count', data: { count: unread } })}\n\n`))

      subscribe(userId, c)

      // Keepalive ping every 25s
      const ping = setInterval(() => {
        try { c.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'ping' })}\n\n`)) }
        catch { clearInterval(ping) }
      }, 25000)

      request.signal.addEventListener('abort', () => {
        clearInterval(ping)
        unsubscribe(userId, c)
        try { c.close() } catch {}
      })
    },
    cancel() {
      unsubscribe(userId, controller)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
