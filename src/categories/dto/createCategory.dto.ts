import { IsInt, IsPositive, Length, MaxLength } from 'class-validator'

export class CreateCategoryDto {
  @MaxLength(18)
  public readonly manager: string

  @MaxLength(30)
  public readonly label: string

  @MaxLength(150)
  public readonly description: string

  @IsInt()
  @IsPositive()
  public readonly maxScore: number

  @Length(4)
  public readonly evalDateStart: string

  @Length(4)
  public readonly evalDateStop: string
}
