import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { Contact } from 'generated/prisma';
import { WebResponse } from 'src/model/web.model';
import { AddressResponse } from 'src/model/address.model';

describe('AddressController', () => {
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

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${(contact as Contact).id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      const resBody = response.body as WebResponse<AddressResponse>;

      logger.info(resBody);

      expect(response.status).toBe(400);
      expect(resBody.errors).toBeDefined();
    });

    it('should be able to create address', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${(contact as Contact).id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          country: 'negara test',
          postal_code: '1111',
        });

      const resBody = response.body as WebResponse<AddressResponse>;

      logger.info(resBody);

      expect(response.status).toBe(200);
      expect(resBody.data?.id).toBeDefined();
      expect(resBody.data?.street).toBe('jalan test');
      expect(resBody.data?.city).toBe('kota test');
      expect(resBody.data?.province).toBe('provinsi test');
      expect(resBody.data?.country).toBe('negara test');
      expect(resBody.data?.postal_code).toBe('1111');
    });
  });
});
