import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from '../../src/todos/todos.module';
import { CategoriesModule } from '../../src/categories/categories.module';
import { TodoEntity } from '../../src/entities/todo.entity';
import { CategoryEntity } from '../../src/entities/category.entity';

@Module({
  imports: [
    TodosModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:', // in-memory DB
      entities: [TodoEntity, CategoryEntity],
      synchronize: true, // auto create tables
      dropSchema: true, // reset DB each connection
    }),
  ],
})
export class TestAppModule {}
