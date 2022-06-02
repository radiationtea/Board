import { Controller, Get } from '@nestjs/common'
import { ResponseBody } from '../interfaces/ResponseBody'
import { Categories } from './categories.entities'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {
  private categoriesService: CategoriesService

  constructor (categoriesService: CategoriesService) {
    this.categoriesService = categoriesService
  }

  @Get()
  async listCategories (): Promise<ResponseBody<{ categories: Categories[] }>> {
    return {
      success: true,
      data: {
        categories: await this.categoriesService.listCategories()
      }
    }
  }
}
