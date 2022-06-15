import { IsInt, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsInt()
  readonly subcategoryId: number

  @MaxLength(100)
  readonly content: string
}
