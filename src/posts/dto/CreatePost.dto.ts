import { Transform } from 'class-transformer'
import { IsNumberString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsNumberString()
  @Transform(() => Number)
  readonly subcategoryId: number

  @MaxLength(100)
  readonly content: string
}
