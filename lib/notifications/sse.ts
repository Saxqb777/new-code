import type { SSEEvent } from '@/types'

const channels = new Map<string, Set<ReadableStreamDefaultController>>()

export function subscribe(userId: string, controller: ReadableStreamDefaultController) {
  if (!channels.has(userId)) channels.set(userId, new Set())
  channels.get(userId)!.add(controller)
}

export function unsubscribe(userId: string, controller: ReadableStreamDefaultController) {
  channels.get(userId)?.delete(controller)
  if (channels.get(userId)?.size === 0) channels.delete(userId)
}

export function broadcast(userId: string, event: SSEEvent) {
  const controllers = channels.get(userId)
  if (!controllers?.size) return
  const data = `data: ${JSON.stringify(event)}\n\n`
  for (const controller of controllers) {
    try {
      controller.enqueue(data)
    } catch {
      controllers.delete(controller)
    }
  }
}
