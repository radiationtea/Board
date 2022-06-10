import { IsInt, IsPositive, MaxLength } from 'class-validator'

export class CreateSubcategoryDto {
  @IsInt()
  @IsPositive()
  public readonly score: number

  @MaxLength(30)
  public readonly label: string
}
