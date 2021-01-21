import { NestFactory } from '@nestjs/core';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';

import ApplicationModule from '@src/app.module';
import { setUp } from '@src/app.service';

function throwError(error: Error): never {
  throw new InternalServerErrorException(error);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  setUp(app).catch(throwError);
}
bootstrap();
