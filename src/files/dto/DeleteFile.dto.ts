import { IsUUID } from 'class-validator'

export class DeleteFileDto {
  @IsUUID()
  readonly fileId: string
}
