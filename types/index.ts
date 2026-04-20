export type {
  GlobalRole,
  ProjectRole,
  ProjectStatus,
  MilestoneStatus,
  AssetType,
  AssetStatus,
  ReviewStatus,
  NotificationType,
  SocialPlatform,
} from '@prisma/client'

export interface SSENotificationEvent {
  type: 'notification'
  data: {
    id: string
    title: string
    body: string
    linkUrl?: string | null
    notificationType: string
    createdAt: string
  }
}

export interface SSEUnreadCountEvent {
  type: 'unread_count'
  data: { count: number }
}

export interface SSEPingEvent {
  type: 'ping'
}

export type SSEEvent = SSENotificationEvent | SSEUnreadCountEvent | SSEPingEvent

export interface VisibilityProjectSummary {
  id: string
  title: string
  clientName: string | null
  status: string
  dueDate: string | null
  members: { userId: string; name: string; avatarUrl: string | null; role: string }[]
  milestoneCount: number
  completedMilestoneCount: number
  isOverdue: boolean
}

export interface VisibilityTeamMember {
  userId: string
  name: string
  avatarUrl: string | null
  assignments: {
    projectId: string
    projectTitle: string
    role: string
    status: string
    dueDate: string | null
    isOverdue: boolean
  }[]
}

export interface VisibilityAlert {
  type: 'stalled' | 'review_pending' | 'milestone_overdue' | 'unassigned_role'
  projectId: string
  projectTitle: string
  message: string
  severity: 'warning' | 'critical'
}
