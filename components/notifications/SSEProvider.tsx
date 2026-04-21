'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { SSEEvent } from '@/types'

interface NotificationCtx {
  unreadCount: number
  latestNotification: SSEEvent | null
}

const Ctx = createContext<NotificationCtx>({ unreadCount: 0, latestNotification: null })

export function useNotifications() {
  return useContext(Ctx)
}

export function SSEProvider({ initialUnread, children }: { initialUnread: number; children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(initialUnread)
  const [latestNotification, setLatestNotification] = useState<SSEEvent | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource('/api/notifications/stream')
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const event: SSEEvent = JSON.parse(e.data)
        if (event.type === 'unread_count') {
          setUnreadCount(event.data.count)
        } else if (event.type === 'notification') {
          setLatestNotification(event)
          setUnreadCount(c => c + 1)
        }
      } catch {}
    }

    return () => {
      es.close()
    }
  }, [])

  return <Ctx.Provider value={{ unreadCount, latestNotification }}>{children}</Ctx.Provider>
}
