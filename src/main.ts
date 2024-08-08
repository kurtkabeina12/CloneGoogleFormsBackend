/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Увеличиваем максимально допустимый размер тела запроса до 100MB
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ limit: '100mb', extended: true }));

    const config = new DocumentBuilder()
      .setTitle('API документация')
      .setDescription('Демонстрация Swagger в NestJS')
      .setVersion('1.0')
      .addTag('cards')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(8888);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();