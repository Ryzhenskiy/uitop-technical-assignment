import { DataSource } from 'typeorm';
import { CategoryEntity } from '../../src/entities/category.entity';

export async function seedTestCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(CategoryEntity);

  const categories = [
    { name: 'Work' },
    { name: 'Personal' },
    { name: 'Hobby' },
  ];

  for (const cat of categories) {
    const category = repo.create(cat);
    await repo.save(category);
  }
}
