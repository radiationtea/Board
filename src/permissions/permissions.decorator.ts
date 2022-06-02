import { SetMetadata } from '@nestjs/common'

export const Require =
  (...perms: string[]) => SetMetadata('require_perms', perms)
