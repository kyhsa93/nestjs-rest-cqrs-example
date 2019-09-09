import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { cors: true });

  const options = new DocumentBuilder()
    .setTitle('nest.js sample')
    .setDescription('Nest.js sample project')
    .setVersion('1.0')
    .addTag('Products')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.use(compression());
  app.use(new RateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  await app.listen(5000);
}
bootstrap();
