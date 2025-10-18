import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepo: Repository<CategoryEntity>,
  ) {}

  async getCategories() {
    const categories = await this.categoriesRepo.find({});
    return categories;
  }

  async getCategoryWithIncompleteTodosCount(id: number) {
    const category = (await this.categoriesRepo
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.incompleteTodosCount',
        'category.todos',
        'todo',
        (qb) =>
          qb.andWhere('todo.completed = :completed', { completed: false }),
      )
      .where('category.id = :id', { id })
      .getOne()) as CategoryEntity & { incompleteTodosCount: number };

    return category;
  }
}
