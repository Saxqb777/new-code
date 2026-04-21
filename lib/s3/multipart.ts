import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, S3_BUCKET } from './client'

export async function initiateMultipart(key: string, mimeType: string) {
  const cmd = new CreateMultipartUploadCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: mimeType,
    ServerSideEncryption: 'AES256',
  })
  const result = await s3.send(cmd)
  return result.UploadId!
}

export async function presignPart(uploadId: string, key: string, partNumber: number) {
  const cmd = new UploadPartCommand({
    Bucket: S3_BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  })
  return getSignedUrl(s3, cmd, { expiresIn: 3600 })
}

export async function completeMultipart(
  uploadId: string,
  key: string,
  parts: { PartNumber: number; ETag: string }[]
) {
  const cmd = new CompleteMultipartUploadCommand({
    Bucket: S3_BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  })
  return s3.send(cmd)
}

export async function abortMultipart(uploadId: string, key: string) {
  await s3.send(new AbortMultipartUploadCommand({ Bucket: S3_BUCKET, Key: key, UploadId: uploadId }))
}
