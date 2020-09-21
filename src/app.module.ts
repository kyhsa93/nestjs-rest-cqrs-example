import { Module } from '@nestjs/common';

import AppController from '@src/app.controller';

import AuthModule from '@src/auth/auth.module';
import AccountModule from '@src/account/account.module';

@Module({
  imports: [AccountModule, AuthModule],
  controllers: [AppController],
})
export default class ApplicationModule {}
