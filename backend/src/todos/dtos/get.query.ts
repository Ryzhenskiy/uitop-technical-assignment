import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTodosQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}
