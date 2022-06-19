import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { PostsModule } from 'src/posts/posts.module'
import { FilesController } from './files.controller'
import { Files } from './files.entity'
import { FilesService } from './files.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Files]),
    PostsModule,
    ConfigModule,
    PermissionsModule
  ],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
