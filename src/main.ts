import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJs MasterClass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:5000')
    .setTermsOfService('http://localhost:5000/terms-of-service')
    .setLicense('MIT License', 'http://localhost:5000/license')
    .addServer('http://localhost:5000')
    .setVersion('1.0')
    .build();

  // initantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
