import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { ResponseBody } from '../interfaces/ResponseBody'
import { Categories } from './categories.entities'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/createCategory.dto'
import { CreateSubcategoryDto } from './dto/CreateSubcategory.dto'
import { EditCategoryDto } from './dto/EditCategory.dto'
import { EditSubcategoryDto } from './dto/EditSubcategory.dto'

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

  @Post(':id')
  @Require('MANAGE_CATEGORIES')
  @UseGuards(PermissionsGuard)
  async createSubcategory (@Body() body: CreateSubcategoryDto, @Param('id') categoryId: string):
    Promise<ResponseBody<{ subcategoryId: string }>> {
    const parsedCategoryId = parseInt(categoryId)
    if (Number.isNaN(parsedCategoryId)) {
      throw new BadRequestException()
    }

    const result = await this.categoriesService.createSubcategory(parsedCategoryId, body)
    return {
      success: true,
      data: {
        subcategoryId: result
      }
    }
  }

  @Put(':category')
  @Require('MANAGE_CATEGORIES')
  @UseGuards(PermissionsGuard)
  async editCategory (@Body() body: EditCategoryDto, @Param('category') categoryId: string):
    Promise<ResponseBody<undefined>> {
    const parsedCategoryId = parseInt(categoryId)
    if (Number.isNaN(parsedCategoryId)) {
      throw new BadRequestException()
    }

    const isExist = await this.categoriesService.getCategory(parsedCategoryId)
    if (!isExist) {
      throw new NotFoundException()
    }

    await this.categoriesService.editCategory(parsedCategoryId, body)

    return {
      success: true
    }
  }

  @Put(':category/:subcate')
  @Require('MANAGE_CATEGORIES')
  @UseGuards(PermissionsGuard)
  async editSubcategory (@Body() body: EditSubcategoryDto, @Param('category') _: string, @Param('subcate') subcate: string):
    Promise<ResponseBody<undefined>> {
    const parsedSubcategoryId = parseInt(subcate)

    if (Number.isNaN(parsedSubcategoryId)) {
      throw new BadRequestException()
    }

    const isExist = await this.categoriesService.getSubcategory(parsedSubcategoryId)
    if (!isExist) {
      throw new NotFoundException()
    }

    await this.categoriesService.editCategory(parsedSubcategoryId, body)

    return {
      success: true
    }
  }
}
