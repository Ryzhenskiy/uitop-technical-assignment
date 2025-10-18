import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TestAppModule } from '../utils/test-app.module.test';
import { seedTestCategories } from '../utils/test-seed.test';
import { TodoEntity } from '../../src/entities/todo.entity';
import { CategoryEntity } from '../../src/entities/category.entity';

// todo tests can be definetly improved, not gonna lie some of configuration and test cases were generated with help
// of AI, but anyway, insturctions and all other stuff was made by, and adjusted by me
describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await seedTestCategories(dataSource); // always seed categories

    const categoryRepo = dataSource.getRepository(CategoryEntity);
    const todoRepo = dataSource.getRepository(TodoEntity);

    const workCategory = (await categoryRepo.findOne({
      where: { name: 'Work' },
    })) as CategoryEntity;
    const personalCategory = (await categoryRepo.findOne({
      where: { name: 'Personal' },
    })) as CategoryEntity;

    // create a todo for GET, PATCH, DELETE tests
    const todo = todoRepo.create({
      title: 'Existing Todo',
      completed: false,
      category: workCategory,
    });
    await todoRepo.save(todo);

    // optionally, create multiple todos for GET list
    const anotherTodo = todoRepo.create({
      title: 'Another Todo',
      completed: false,
      category: personalCategory,
    });
    await todoRepo.save(anotherTodo);
  });

  afterEach(async () => {
    // clear child first, then parent to avoid FK errors
    const todoRepo = dataSource.getRepository(TodoEntity);
    const categoryRepo = dataSource.getRepository(CategoryEntity);

    await todoRepo.clear();
    await categoryRepo.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('[POST /todos] Create todo', () => {
    it('should create a todo successfully', async () => {
      const category = (await dataSource
        .getRepository(CategoryEntity)
        .findOne({ where: { name: 'Work' } })) as CategoryEntity;

      const res = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Test Todo', categoryId: category.id })
        .expect(201);

      expect(typeof +res.text).toBe('number');
    });

    it('should fail if category does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Invalid Category', categoryId: 9999 })
        .expect(404);

      expect(res.body.message).toBe('Such category does not exist');
    });

    it('should fail if max todos per category exceeded', async () => {
      const category = (await dataSource
        .getRepository(CategoryEntity)
        .findOne({ where: { name: 'Personal' } })) as CategoryEntity;

      const todosRepo = dataSource.getRepository(TodoEntity);
      await todosRepo.clear();
      for (let i = 0; i < 5; i++) {
        const todo = todosRepo.create({
          title: `Todo ${i}`,
          category,
          completed: false,
        });
        await todosRepo.save(todo);
      }

      const res = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Overflow Todo', categoryId: category.id })
        .expect(400);

      expect(res.body.message).toBe('Max amount of todos is 5');
    });
  });

  describe('[GET /todos] List todos', () => {
    it('should list all incomplete todos', async () => {
      const res = await request(app.getHttpServer()).get('/todos').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('category');
    });
  });

  describe('[PATCH /todos/:id] Toggle todo', () => {
    it('should toggle todo completed status', async () => {
      const todo = (await dataSource
        .getRepository(TodoEntity)
        .findOne({ where: {} })) as TodoEntity;
      const prevCompleted = todo.completed;

      const res = await request(app.getHttpServer())
        .patch(`/todos/${todo.id}`)
        .expect(200);

      expect(res.text).toBe('success');

      const updated = (await dataSource
        .getRepository(TodoEntity)
        .findOne({ where: { id: todo.id } })) as TodoEntity;
      expect(updated.completed).toBe(!prevCompleted);
    });

    it('should fail if todo does not exist', async () => {
      const res = await request(app.getHttpServer())
        .patch('/todos/9999')
        .expect(404);

      expect(res.body.message).toBe('Not found todo');
    });
  });

  describe('[DELETE /todos/:id] Delete todo', () => {
    it('should delete a todo successfully', async () => {
      const todo = (await dataSource
        .getRepository(TodoEntity)
        .findOne({ where: {} })) as TodoEntity;

      await request(app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .expect(200);

      const deleted = await dataSource
        .getRepository(TodoEntity)
        .findOne({ where: { id: todo.id } });
      expect(deleted).toBeNull();
    });

    it('should fail if todo does not exist', async () => {
      const res = await request(app.getHttpServer())
        .delete('/todos/9999')
        .expect(404);

      expect(res.body.message).toBe('Not found todo');
    });
  });
});
