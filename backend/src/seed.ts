import { DataSource } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { TodoEntity } from './entities/todo.entity';

export const CATEGORIES_SEED = [
  {
    name: 'Category 1',
  },
  {
    name: 'Category 2',
  },
  {
    name: 'Category 3',
  },
];

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true,
  entities: [CategoryEntity, TodoEntity],
});

async function seed() {
  try {
    await dataSource.initialize();

    const categoryRepo = dataSource.getRepository(CategoryEntity);

    for (const c of CATEGORIES_SEED) {
      const exists = await categoryRepo.findOneBy({ name: c.name });
      if (!exists) {
        await categoryRepo.save(c);
      }
    }
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
