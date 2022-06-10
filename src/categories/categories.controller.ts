import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { ResponseBody } from '../interfaces/ResponseBody'
import { Categories } from './categories.entities'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/createCategory.dto'

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

  @Post()
  @Require('MANAGE_CATEGORIES')
  @UseGuards(PermissionsGuard)
  async createCategory (@Body() body: CreateCategoryDto):
    Promise<ResponseBody<{ categoryId: string }>> {
    const result = await this.categoriesService.createCategory(body)

    return {
      success: true,
      data: {
        categoryId: result
      }
    }
  }
}
