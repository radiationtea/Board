import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from 'src/categories/categories.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { PostsController } from './posts.controller'
import { History, Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, History]),
    PermissionsModule,
    CategoriesModule,
    IntegrationsModule
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
