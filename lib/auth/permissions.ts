import type { AssetType, ProjectRole } from '@prisma/client'

export function canUploadRawFootage(roles: ProjectRole[]): boolean {
  return roles.includes('SHOOTER')
}

export function canUploadFinalEdit(roles: ProjectRole[]): boolean {
  return roles.includes('EDITOR')
}

export function canApproveReview(roles: ProjectRole[]): boolean {
  return roles.includes('CLIENT')
}

export function canManageMembers(roles: ProjectRole[], globalRole: string): boolean {
  return globalRole === 'AGENCY_ADMIN' || roles.includes('PROJECT_MANAGER')
}

export function canManageProject(roles: ProjectRole[], globalRole: string): boolean {
  return globalRole === 'AGENCY_ADMIN' || roles.includes('PROJECT_MANAGER')
}

export function canViewAsset(roles: ProjectRole[], globalRole: string, assetType: AssetType): boolean {
  if (globalRole === 'AGENCY_ADMIN') return true
  if (assetType === 'RAW_FOOTAGE') {
    return roles.includes('SHOOTER') || roles.includes('EDITOR') || roles.includes('PROJECT_MANAGER')
  }
  return true
}

export function canViewAnalytics(roles: ProjectRole[], globalRole: string): boolean {
  if (globalRole === 'AGENCY_ADMIN') return true
  return roles.includes('PROJECT_MANAGER') || roles.includes('CLIENT')
}

export function canViewVisibilityDashboard(globalRole: string, roles: ProjectRole[]): boolean {
  return globalRole === 'AGENCY_ADMIN' || roles.includes('PROJECT_MANAGER') || roles.includes('CLIENT')
}

export function canCreateProject(globalRole: string, roles: ProjectRole[]): boolean {
  return globalRole === 'AGENCY_ADMIN' || roles.some(r => r === 'PROJECT_MANAGER')
}
