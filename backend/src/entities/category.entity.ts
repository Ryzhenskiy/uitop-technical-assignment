import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CategoryEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => TodoEntity, (todo) => todo.category)
  todos: TodoEntity[];
}
