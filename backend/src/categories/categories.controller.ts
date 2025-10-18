import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from '../entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiResponse({
    description: 'Retrieve all available categories',
    isArray: true,
    type: CategoryEntity,
  })
  @Get()
  getCategories() {
    return this.service.getCategories();
  }
}
