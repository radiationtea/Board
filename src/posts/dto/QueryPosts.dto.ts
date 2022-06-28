import { IsInt, IsOptional, Max, Min, IsBoolean } from 'class-validator'
import { Expose, Type } from 'class-transformer'

export class QueryPostsDto {
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

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly closed?: boolean
}
