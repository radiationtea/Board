import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { Permissions, Roles } from './permissions.entities'

@Injectable()
export class PermissionsService {
  private roles: Repository<Roles>
  private permissions: Repository<Permissions>
  private usersService: UsersService

  constructor (
    @InjectRepository(Roles)
      roles: Repository<Roles>,
    @InjectRepository(Permissions)
      permissions: Repository<Permissions>,
      usersService: UsersService
  ) {
    this.roles = roles
    this.permissions = permissions
    this.usersService = usersService
  }

  public async hasPermission (userId: string, label: string) {
    const user = await this.usersService.getUser(userId)
    if (!user) return false

    const roles = await this.listRoles(userId)
    if (!roles) return false

    const perms = await this.listPermissions(roles)
    return perms.has(label)
  }

  private listRoles (userId: string) {
    return this.roles.find({
      where: {
        userId
      }
    })
  }

  private async listPermissions (roles: Roles[]) {
    const permissions = new Set<string>()

    for (const role of roles) {
      const perms = await this.permissions.find({
        where: {
          roleId: role.roleId
        }
      })

      for (const perm of perms) {
        permissions.add(perm.label)
      }
    }

    return permissions
  }
}
