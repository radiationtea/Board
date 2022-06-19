import { IsNumber, IsPositive, IsString } from 'class-validator'

export class UploadFileDto {
  @IsString()
  readonly fileName: string

  @IsNumber()
  @IsPositive()
  readonly postId: number
}
