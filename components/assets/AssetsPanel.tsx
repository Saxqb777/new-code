'use client'

import { useState } from 'react'
import { Upload, Film, FileVideo, Image as ImageIcon, File } from 'lucide-react'
import { formatBytes, formatDate, formatDuration } from '@/lib/utils'
import AssetUploader from '@/components/assets/AssetUploader'

type AssetType = 'RAW_FOOTAGE' | 'EDIT_DRAFT' | 'FINAL_EDIT' | 'THUMBNAIL' | 'SUPPORTING'
type AssetStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'REJECTED'

interface AssetItem {
  id: string
  type: AssetType
  title: string
  status: AssetStatus
  createdAt: string
  latestVersion: {
    versionNumber: number
    fileSizeBytes: number
    mimeType: string
    durationMs: number | null
    uploadedBy: string
    createdAt: string
  } | null
}

interface Props {
  projectId: string
  projectStatus: string
  assets: AssetItem[]
  canUploadRaw: boolean
  canUploadFinal: boolean
  canUpload: boolean
}

const typeConfig: Record<AssetType, { label: string; icon: React.ReactNode; color: string }> = {
  RAW_FOOTAGE: { label: 'Raw Footage',  icon: <Film size={16} />,      color: 'bg-amber-100 text-amber-700' },
  EDIT_DRAFT:  { label: 'Edit Draft',   icon: <FileVideo size={16} />, color: 'bg-violet-100 text-violet-700' },
  FINAL_EDIT:  { label: 'Final Edit',   icon: <FileVideo size={16} />, color: 'bg-green-100 text-green-700' },
  THUMBNAIL:   { label: 'Thumbnail',    icon: <ImageIcon size={16} />, color: 'bg-sky-100 text-sky-700' },
  SUPPORTING:  { label: 'Supporting',   icon: <File size={16} />,      color: 'bg-slate-100 text-slate-600' },
}

const statusConfig: Record<AssetStatus, { label: string; color: string }> = {
  UPLOADING:  { label: 'Uploading',  color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', color: 'bg-amber-100 text-amber-700' },
  READY:      { label: 'Ready',      color: 'bg-emerald-100 text-emerald-700' },
  REJECTED:   { label: 'Rejected',   color: 'bg-red-100 text-red-700' },
}

export default function AssetsPanel({ projectId, projectStatus, assets: initial, canUploadRaw, canUploadFinal, canUpload }: Props) {
  const [assets, setAssets] = useState(initial)
  const [showUploader, setShowUploader] = useState(false)
  const [uploadType, setUploadType] = useState<'RAW_FOOTAGE' | 'FINAL_EDIT'>('RAW_FOOTAGE')

  function openUploader(type: 'RAW_FOOTAGE' | 'FINAL_EDIT') {
    setUploadType(type)
    setShowUploader(true)
  }

  function onUploadComplete(newAsset: AssetItem) {
    setAssets(prev => [newAsset, ...prev])
    setShowUploader(false)
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <div className="flex gap-2 justify-end flex-wrap">
          {canUploadRaw && (
            <button
              onClick={() => openUploader('RAW_FOOTAGE')}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={16} /> Upload raw footage
            </button>
          )}
          {canUploadFinal && (
            <button
              onClick={() => openUploader('FINAL_EDIT')}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={16} /> Upload final edit
            </button>
          )}
        </div>
      )}

      {showUploader && (
        <AssetUploader
          projectId={projectId}
          assetType={uploadType}
          onComplete={onUploadComplete}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {assets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="font-semibold text-slate-900">No assets yet</h3>
          <p className="text-slate-500 text-sm mt-1">
            {canUpload ? 'Upload footage to get started.' : 'Assets will appear here once uploaded.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {assets.map(a => {
            const tc = typeConfig[a.type]
            const sc = statusConfig[a.status]
            return (
              <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tc.color}`}>
                  {tc.icon} {tc.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm">{a.title}</div>
                  {a.latestVersion && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      v{a.latestVersion.versionNumber} · {formatBytes(a.latestVersion.fileSizeBytes)}
                      {a.latestVersion.durationMs && ` · ${formatDuration(a.latestVersion.durationMs)}`}
                      {' · '}by {a.latestVersion.uploadedBy}
                      {' · '}{formatDate(a.latestVersion.createdAt)}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.color}`}>
                  {sc.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
