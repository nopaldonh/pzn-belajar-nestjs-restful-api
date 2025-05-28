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
import { Contact } from 'generated/prisma';

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

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${(contact as Contact).id + 1}`)
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(404);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${(contact as Contact).id}`)
        .set('Authorization', 'test');

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

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${(contact as Contact).id}`)
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

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${(contact as Contact).id + 1}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '9999',
        });

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(404);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${(contact as Contact).id}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'test updated',
          last_name: 'test updated',
          email: 'testupdated@example.com',
          phone: '8888',
        });

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.id).toBeDefined();
      expect(resBody.data?.first_name).toBe('test updated');
      expect(resBody.data?.last_name).toBe('test updated');
      expect(resBody.data?.email).toBe('testupdated@example.com');
      expect(resBody.data?.phone).toBe('8888');
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${(contact as Contact).id + 1}`)
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse>;

      logger.info(resBody);

      expect(response.status).toBe(404);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to remove contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${(contact as Contact).id}`)
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<boolean>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data).toBe(true);
    });
  });

  describe('GET /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be able to search contacts', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(1);
    });

    it('should be able to search contacts by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'es',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(1);
    });

    it('should be able to search contacts by name not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'wrong',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(0);
    });

    it('should be able to search contacts by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'es',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(1);
    });

    it('should be able to search contacts by email not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'wrong',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(0);
    });

    it('should be able to search contacts by phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '99',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(1);
    });

    it('should be able to search contacts by phone not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '88',
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', 'test');

      const resBody = response.body as WebResponse<ContactResponse[]>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.length).toBe(0);
      expect(resBody.paging?.current_page).toBe(2);
      expect(resBody.paging?.total_page).toBe(1);
      expect(resBody.paging?.size).toBe(1);
    });
  });
});
