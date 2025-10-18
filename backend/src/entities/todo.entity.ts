import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.todos)
  @JoinColumn({ name: 'categoryId' }) // <-- ensures a column in DB
  category: CategoryEntity;
}
