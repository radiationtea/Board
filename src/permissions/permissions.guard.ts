import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PermissionsService } from './permissions.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  private permissionsService: PermissionsService
  private reflector: Reflector

  constructor (
    permissionsService: PermissionsService,
    reflector: Reflector
  ) {
    this.permissionsService = permissionsService
    this.reflector = reflector
  }

  public async canActivate (context: ExecutionContext) {
    const userId =
      context.switchToHttp().getResponse().locals.userId
    const requiredPermissions =
      this.reflector.get<string[]>('require_perms', context.getHandler())!

    if (!userId) return false

    for (const permission of requiredPermissions) {
      const result =
        await this.permissionsService.hasPermission(userId, permission)

      if (!result) return false
    }

    return true
  }
}
