import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { presignPart } from '@/lib/s3/multipart'

const schema = z.object({
  uploadId: z.string().min(1),
  key: z.string().min(1),
  partNumber: z.number().int().min(1).max(10000),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const presignedUrl = await presignPart(parsed.data.uploadId, parsed.data.key, parsed.data.partNumber)
  return NextResponse.json({ presignedUrl })
}
