import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categories, Subcategories } from './categories.entities'

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

  public getSubcategory (subId: number) {
    return this.subcategories.findOne(subId, {
      relations: ['parent']
    })
  }
}
