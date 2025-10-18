import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create.dto';
import { CategoriesService } from '../categories/categories.service';
import { GetTodosQuery } from './dtos/get.query';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
    @Inject() private readonly categoryService: CategoriesService,
  ) {}
  private MAX_AMOUNT_OF_TODOS_PER_CATEGORY = 5;

  async createTodo(dto: CreateTaskDto) {
    const category =
      await this.categoryService.getCategoryWithIncompleteTodosCount(
        dto.categoryId,
      );

    if (!category) {
      throw new NotFoundException('Such category does not exist');
    }
    if (
      category?.incompleteTodosCount >= this.MAX_AMOUNT_OF_TODOS_PER_CATEGORY
    ) {
      throw new BadRequestException(
        `Max amount of todos is ${this.MAX_AMOUNT_OF_TODOS_PER_CATEGORY}`,
      );
    }
    let todo = this.todoRepo.create(dto);
    try {
      todo = await this.todoRepo.save({ ...dto, category });
    } catch (err) {
      this.logger.error(`[createTodo] error -> ${JSON.stringify({ err })}`);
      throw new InternalServerErrorException('Something went wrong');
    }

    return todo.id;
  }

  async deleteTodo(id: number) {
    const todo = await this.todoRepo.findOne({
      where: {
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException('Not found todo');
    }
    await this.todoRepo.remove(todo);
    return true;
  }

  async toggleTodoCompleted(id: number) {
    const todo = await this.todoRepo.findOne({
      where: {
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException('Not found todo');
    }

    todo.completed = !todo.completed;
    await this.todoRepo.save(todo);
    return 'success';
  }

  async getTodos(query: GetTodosQuery) {
    const todos = this.todoRepo.find({
      where: {
        ...(query.category
          ? {
              category: {
                name: query.category,
              },
            }
          : {}),
        completed: false,
      },
      relations: ['category'],
    });
    return todos;
  }
}
