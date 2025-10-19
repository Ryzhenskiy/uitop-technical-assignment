import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoryEntity } from './entities/category.entity';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get('NODE_ENV') === 'production';
        return {
          type: 'better-sqlite3',
          database:
            cfg.get<string>('SQLITE_PATH') ||
            (cfg.get('NODE_ENV') === 'test' ? ':memory:' : 'database.sqlite'),
          entities: [CategoryEntity, TodoEntity],
          // Use synchronize for dev only. In prod prefer proper migrations.
          synchronize: !isProd,
          // logging: !isProd,
        };
      },
    }),
    TodosModule,
    CategoriesModule,
  ],
})
export class AppModule {}
