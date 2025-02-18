import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { config } from 'dotenv';

config(); // Load .env before tests

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('S3_BUCKET:', process.env.S3_BUCKET); // Debugging output

    return request(app.getHttpServer()).get('/').expect(200);
  });
});
