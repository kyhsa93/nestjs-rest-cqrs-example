import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from 'libs/DatabaseModule';
import { MessageModule } from 'libs/MessageModule';
import { RequestStorageMiddleware } from 'libs/RequestStorageMiddleware';

import { AppController } from 'src/AppController';
import { DatabaseScheduler } from 'src/infrastructure/scheduler/database-scheduler';
import { OutboxModule } from 'src/outbox/OutboxModule';
import { AccountsModule } from 'src/account/AccountsModule';
import { NotificationModule } from 'src/notification/NotificationModule';

@Module({
  imports: [
    AccountsModule,
    DatabaseModule,
    MessageModule,
    OutboxModule,
    CacheModule.register({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    DatabaseScheduler,
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
