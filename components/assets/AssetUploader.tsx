'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_CONCURRENT = 3

interface Props {
  projectId: string
  assetType: 'RAW_FOOTAGE' | 'FINAL_EDIT'
  onComplete: (asset: any) => void
  onCancel: () => void
}

type State = 'idle' | 'selecting' | 'uploading' | 'complete' | 'error'

export default function AssetUploader({ projectId, assetType, onComplete, onCancel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<State>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setState('selecting') }
  }

  async function startUpload() {
    if (!file) return
    setState('uploading')
    setProgress(0)
    setError('')

    try {
      // Step 1: Initiate
      const initRes = await fetch('/api/uploads/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          assetType,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      })
      if (!initRes.ok) throw new Error('Failed to initiate upload')
      const { assetId, versionId, uploadId, key } = await initRes.json()

      // Step 2: Upload chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      const parts: { PartNumber: number; ETag: string }[] = []
      let uploaded = 0

      const uploadChunk = async (partNumber: number) => {
        const start = (partNumber - 1) * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const blob = file.slice(start, end)

        const presignRes = await fetch('/api/uploads/presign-part', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uploadId, key, partNumber }),
        })
        if (!presignRes.ok) throw new Error(`Failed to presign part ${partNumber}`)
        const { presignedUrl } = await presignRes.json()

        let retries = 0
        while (retries < 3) {
          try {
            const putRes = await fetch(presignedUrl, {
              method: 'PUT',
              body: blob,
              headers: { 'Content-Type': file.type },
            })
            if (!putRes.ok) throw new Error(`Part ${partNumber} upload failed`)
            const etag = putRes.headers.get('ETag') ?? ''
            parts.push({ PartNumber: partNumber, ETag: etag })
            uploaded++
            setProgress(Math.round((uploaded / totalChunks) * 100))
            return
          } catch {
            retries++
            if (retries === 3) throw new Error(`Part ${partNumber} failed after 3 retries`)
            await new Promise(r => setTimeout(r, 1000 * retries))
          }
        }
      }

      // Upload with concurrency limit
      const queue = Array.from({ length: totalChunks }, (_, i) => i + 1)
      while (queue.length > 0) {
        const batch = queue.splice(0, MAX_CONCURRENT)
        await Promise.all(batch.map(uploadChunk))
      }

      // Step 3: Complete
      parts.sort((a, b) => a.PartNumber - b.PartNumber)
      const completeRes = await fetch('/api/uploads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, key, versionId, assetId, parts }),
      })
      if (!completeRes.ok) throw new Error('Failed to complete upload')
      const data = await completeRes.json()

      setState('complete')
      onComplete(data.asset)
    } catch (e: any) {
      setError(e.message ?? 'Upload failed')
      setState('error')
    }
  }

  const label = assetType === 'RAW_FOOTAGE' ? 'raw footage' : 'final edit'

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-brand-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">
          Upload {label}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      {state === 'idle' || state === 'selecting' ? (
        <div className="space-y-4">
          <div
            className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500 cursor-pointer hover:text-brand-600 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={32} />
            <span className="text-sm">{file ? file.name : `Click to select ${label}`}</span>
            {file && <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onFileChange}
          />
          {file && (
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startUpload}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Upload
              </button>
            </div>
          )}
        </div>
      ) : state === 'uploading' ? (
        <div className="space-y-3">
          <div className="text-sm text-slate-600">Uploading {file?.name}…</div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-slate-500 text-right">{progress}%</div>
        </div>
      ) : state === 'complete' ? (
        <div className="text-center py-4 text-emerald-600 font-medium text-sm">
          ✅ Upload complete!
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
          <button
            onClick={() => setState('selecting')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
