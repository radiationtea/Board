import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'

export class QueryPostsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  readonly closed: boolean

  @IsOptional()
  @IsInt()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  @Expose({ name: 'per_pages' })
  readonly perPages?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly page?: number
}
