import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Go for a walk with dog',
    description: 'Description of task',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 5,
    description: 'Id of category to which entity will be related to',
  })
  @IsNumber()
  categoryId: number;
}
