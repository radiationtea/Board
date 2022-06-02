import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesController } from './categories.controller'
import { Categories, Subcategories } from './categories.entities'
import { CategoriesService } from './categories.service'

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Subcategories])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
