import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryEntity } from './entities/category.entity';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [
    TodosModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database:
        process?.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
      entities: [CategoryEntity, TodoEntity],
      synchronize: true, // dev only
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
