import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, S3_BUCKET } from './client'

export async function getReadPresignedUrl(key: string, expiresIn = 3600) {
  const cmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })
  return getSignedUrl(s3, cmd, { expiresIn })
}
