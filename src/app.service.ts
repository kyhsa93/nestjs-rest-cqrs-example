import { INestApplication, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppConfiguration from '@src/app.config';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';

import AccountEntity from '@src/account/infrastructure/entity/account';

export const setUp = async (app: INestApplication): Promise<void> => {
  /**
   * set up swagger document
   */
  const swaggerOptions = new DocumentBuilder()
    .setTitle('nest.js example')
    .setDescription('Nest.js example project')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey' }, 'header')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  /**
   * set up middleware
   */
  app.use(helmet());
  app.use(compression());
  app.use(new RateLimit({}));

  await app.listen(AppConfiguration.port);
};

export default class AppService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | undefined;

  public async onModuleInit(): Promise<void> {
    const entities = [AccountEntity];
    const databaseOptions = { ...AppConfiguration.database, entities };
    this.connection = await createConnection(databaseOptions);
    if (!this.connection) process.exit(1);
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.connection) await this.connection.close();
  }
}
