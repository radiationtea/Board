import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { NoticesController } from './notices.controller'
import { Notices } from './notices.entity'
import { NoticesService } from './notices.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Notices]),
    PermissionsModule
  ],
  controllers: [NoticesController],
  providers: [NoticesService]
})
export class NoticesModule {}
