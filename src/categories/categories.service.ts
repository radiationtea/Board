import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categories, Subcategories } from './categories.entities'
import { CreateCategoryDto } from './dto/createCategory.dto'
import { CreateSubcategoryDto } from './dto/CreateSubcategory.dto'
import { EditCategoryDto } from './dto/EditCategory.dto'
import { EditSubcategoryDto } from './dto/EditSubcategory.dto'

@Injectable()
export class CategoriesService {
  private categories: Repository<Categories>
  private subcategories: Repository<Subcategories>

  constructor (
    @InjectRepository(Categories)
      categories: Repository<Categories>,
    @InjectRepository(Subcategories)
      subcategories: Repository<Subcategories>
  ) {
    this.subcategories = subcategories
    this.categories = categories
  }

  public listCategories () {
    return this.categories.find({
      relations: ['children']
    })
  }

  public getCategory (cateId: number) {
    return this.categories.findOne({
      where: {
        categoryId: cateId
      }
    })
  }

  public getSubcategory (subId: number) {
    return this.subcategories.findOne({
      relations: ['parent'],
      where: {
        subcategoryId: subId
      }
    })
  }

  public async createCategory (data: CreateCategoryDto) {
    const result = await this.categories.insert(data)
    return result.generatedMaps[0].categoryId
  }

  public async createSubcategory (categoryId: number, data: CreateSubcategoryDto) {
    const result = await this.subcategories.insert({
      ...data,
      parentId: categoryId
    })
    return result.generatedMaps[0].subcategoryId
  }

  public async editCategory (categoryId: number, data: EditCategoryDto) {
    await this.categories.update({
      categoryId
    }, data)
  }

  public async editSubcategory (subcategoryId: number, data: EditSubcategoryDto) {
    await this.subcategories.update({
      subcategoryId
    }, data)
  }

  public async deleteSubcategory (subcategoryId: number) {
    await this.subcategories.delete(subcategoryId)
  }

  public async deleteCategory (categoryId: number) {
    await this.categories.delete(categoryId)
  }

  public async checkEvalable (subcategoryId: number) {
    const subcategory = await this.subcategories.findOne(subcategoryId, {
      relations: ['parent']
    })

    const today = new Date()
    const [, startMonth, startDate] =
      subcategory.parent.evalDateStart
        .match(/(\d{2})(\d{2})/)
        .map((v) => parseInt(v))

    const [, endMonth, endDate] =
      subcategory.parent.evalDateStop
        .match(/(\d{2})(\d{2})/)
        .map((v) => parseInt(v))

    if (startMonth > today.getMonth() + 1) return false
    if (startDate > today.getDate()) return false

    if (endMonth < today.getMonth() + 1) return false
    if (endDate < today.getDate()) return false

    return true
  }
}
