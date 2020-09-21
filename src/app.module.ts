import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import AppConfiguration from '@src/app.config';
import AuthModule from '@src/auth/auth.module';
import AccountModule from '@src/account/account.module';

import AccountEntity from '@src/account/infrastructure/entity/account.entity';

import AppController from '@src/app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: AppConfiguration.DATABASE_TYPE,
      host: AppConfiguration.DATABASE_HOST,
      port: AppConfiguration.DATABASE_PORT,
      database: AppConfiguration.DATABASE_NAME,
      username: AppConfiguration.DATABASE_USER,
      password: AppConfiguration.DATABASE_PASSWORD,
      synchronize: true,
      logging: true,
      entities: [AccountEntity],
    }),
    AccountModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
