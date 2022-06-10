import { Optional } from '@nestjs/common'
import { IsInt, IsPositive, Length, MaxLength } from 'class-validator'

export class EditSubcategoryDto {
  @Optional()
  @MaxLength(18)
  public readonly manager: string

  @Optional()
  @MaxLength(30)
  public readonly label: string

  @Optional()
  @MaxLength(150)
  public readonly description: string

  @Optional()
  @IsInt()
  @IsPositive()
  public readonly maxScore: number

  @Optional()
  @Length(4)
  public readonly evalDateStart: string

  @Optional()
  @Length(4)
  public readonly evalDateStop: string
}
