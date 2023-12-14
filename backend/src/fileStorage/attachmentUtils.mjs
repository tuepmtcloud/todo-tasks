import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

export class AttachmentUtils {
  constructor(
    s3Client = AWSXRay.captureAWSv3Client(new S3Client()),
    bucketName = process.env.IMAGES_S3_BUCKET,
    urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {
    this.s3Client = s3Client
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
  }

  async getPresignedURL(userId, todoId) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${userId}/${todoId}`
    })

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpiration
    })
  }
}
