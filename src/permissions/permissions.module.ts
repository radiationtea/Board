import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { Permissions, Roles } from './permissions.entities'
import { PermissionsGuard } from './permissions.guard'
import { PermissionsService } from './permissions.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, Permissions]),
    UsersModule
  ],
  providers: [PermissionsGuard, PermissionsService],
  exports: [PermissionsGuard, PermissionsService]
})
export class PermissionsModule {}
