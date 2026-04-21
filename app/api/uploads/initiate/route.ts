import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { initiateMultipart } from '@/lib/s3/multipart'
import { S3_BUCKET } from '@/lib/s3/client'
import crypto from 'crypto'

const schema = z.object({
  projectId: z.string().min(1),
  assetType: z.enum(['RAW_FOOTAGE','EDIT_DRAFT','FINAL_EDIT','THUMBNAIL','SUPPORTING']),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { projectId, assetType, fileName, fileSize, mimeType } = parsed.data

  // Verify membership
  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  if (!isAdmin) {
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id, removedAt: null },
    })
    if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const key = `projects/${projectId}/${assetType.toLowerCase()}/${crypto.randomUUID()}/${fileName}`
  const uploadId = await initiateMultipart(key, mimeType)

  const result = await prisma.$transaction(async tx => {
    const versionCount = 0
    const asset = await tx.asset.create({
      data: { projectId, type: assetType, title: fileName, status: 'UPLOADING' },
    })
    const version = await tx.assetVersion.create({
      data: {
        assetId: asset.id,
        versionNumber: 1,
        s3Key: key,
        s3Bucket: S3_BUCKET,
        fileSizeBytes: fileSize,
        mimeType,
        uploadedById: session.user.id,
      },
    })
    return { assetId: asset.id, versionId: version.id }
  })

  return NextResponse.json({ ...result, uploadId, key })
}
