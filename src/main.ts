import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppService } from 'src/app.service';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Nest.js example')
    .setDescription('This is example for nest.js')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(AppService.port());
}
bootstrap();
