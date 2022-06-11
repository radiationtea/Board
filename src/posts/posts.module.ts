import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from 'src/categories/categories.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { PostsController } from './posts.controller'
import { Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    PermissionsModule,
    CategoriesModule
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
