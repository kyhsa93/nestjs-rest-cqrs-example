import './timezone';

import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Config } from 'src/config';
import { AppModule } from 'src/app-module';
import { configureApp } from './app-setup';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Nest.js example')
    .setDescription('This is example for nest.js')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ colors: false }),
  });
  app.enableShutdownHooks();
  configureApp(app);
  setupSwagger(app);
  await app.listen(Config.PORT);
}

bootstrap();
