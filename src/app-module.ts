import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from 'libs/database/database-module';
import { MessageModule } from 'libs/message/message-module';
import { RequestStorageMiddleware } from 'libs/database/request-storage-middleware';

import { AppController } from 'src/app-controller';
import { OutboxModule } from 'src/outbox/outbox-module';
import { AccountsModule } from 'src/account/accounts-module';
import { NotificationModule } from 'src/notification/notification-module';

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
