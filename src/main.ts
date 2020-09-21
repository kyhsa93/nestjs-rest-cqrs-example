import { NestFactory } from '@nestjs/core';
import { InternalServerErrorException } from '@nestjs/common';

import ApplicationModule from '@src/app.module';
import { setUp } from '@src/app.service';

function throwError(error: Error): never {
  throw new InternalServerErrorException(error);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule, { cors: true });
  setUp(app).catch(throwError);
}
bootstrap();
