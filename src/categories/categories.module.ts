import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { CategoriesController } from './categories.controller'
import { Categories, Subcategories } from './categories.entities'
import { CategoriesService } from './categories.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories, Subcategories]),
    PermissionsModule,
    IntegrationsModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
