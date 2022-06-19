import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Repository } from 'typeorm'
import { Files } from './files.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FilesService {
  private readonly S3: S3Client
  private readonly BUCKET_NAME: string
  private readonly REGION_NAME: string
  private readonly files: Repository<Files>

  public constructor (config: ConfigService, @InjectRepository(Files) files: Repository<Files>) {
    this.S3 = new S3Client({
      region: config.get<string>('AWS_S3_REGION', 'ap-northeast-2'),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', '')
      }
    })

    this.REGION_NAME = config.get<string>('AWS_S3_REGION', 'ap-northeast-2')
    this.BUCKET_NAME = config.get<string>('AWS_S3_BUCKET', '3c-uploaded')

    this.files = files
  }

  public async createUploadLink (postId: number, fileName: string) {
    const fileId = uuid()
    const putObject = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `files/${fileId}/${fileName}`
    })

    const uploadLink = await getSignedUrl(this.S3, putObject, {
      expiresIn: 3600
    })

    await this.files.insert({
      fileId,
      url: `https://${this.BUCKET_NAME}.s3.${this.REGION_NAME}.amazonaws.com/files/${fileId}/${fileName}`,
      postId
    })

    return uploadLink
  }
}
