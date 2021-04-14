import { NestFactory } from '@nestjs/core';
import { AppService } from 'src/app.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(AppService.port());
}
bootstrap();
