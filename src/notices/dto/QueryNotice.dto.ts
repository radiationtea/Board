import { Expose, Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class QueryNoticeDto {
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
