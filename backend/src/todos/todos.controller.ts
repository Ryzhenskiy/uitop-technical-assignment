import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create.dto';
import { TodosService } from './todos.service';
import { GetTodosQuery } from './dtos/get.query';
import { TodoEntity } from '../entities/todo.entity';

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly service: TodosService) {}

  @ApiResponse({ type: Number, description: 'id of created todo entity' })
  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.service.createTodo(dto);
  }

  @ApiResponse({ type: TodoEntity, description: 'id of created todo entity' })
  @Get()
  async get(@Query() query: GetTodosQuery) {
    return this.service.getTodos(query);
  }

  @Patch('/:id')
  async update(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleTodoCompleted(id);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteTodo(id);
  }
}
