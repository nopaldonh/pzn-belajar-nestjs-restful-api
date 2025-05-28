import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { ContactResponse } from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';

describe('ContactController', () => {
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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        });

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(400);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '9999',
        });

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.id).toBeDefined();
      expect(resBody.data?.first_name).toBe('test');
      expect(resBody.data?.last_name).toBe('test');
      expect(resBody.data?.email).toBe('test@example.com');
      expect(resBody.data?.phone).toBe('9999');
    });
  });
});
