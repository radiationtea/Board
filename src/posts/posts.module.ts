import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { PostsController } from './posts.controller'
import { Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    PermissionsModule
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
