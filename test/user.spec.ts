import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(400);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.username).toBe('test');
      expect(resBody.data?.name).toBe('test');
    });

    it('should be rejected if username already exists', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(400);
      expect(resBody.errors).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(400);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.username).toBe('test');
      expect(resBody.data?.name).toBe('test');
      expect(resBody.data?.token).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong');

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(401);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<UserResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.username).toBe('test');
      expect(resBody.data?.name).toBe('test');
    });
  });
});
