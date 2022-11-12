import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from 'libs/DatabaseModule';
import { MessageModule } from 'libs/MessageModule';
import { RequestStorageMiddleware } from 'libs/RequestStorageMiddleware';

import { AppController } from 'src/AppController';
import { AppService } from 'src/AppService';
import { AccountsModule } from 'src/account/AccountsModule';
import { NotificationModule } from 'src/notification/NotificationModule';

@Module({
  imports: [
    AccountsModule,
    DatabaseModule,
    MessageModule,
    CacheModule.register({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
