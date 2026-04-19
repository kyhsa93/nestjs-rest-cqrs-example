import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EmailAdaptorImplement } from 'src/notification/infrastructure/adaptor/EmailAdaptorImplement';
import { NotificationRepositoryImplement } from 'src/notification/infrastructure/repository/notification-repository-impl';
import { NotificationQueryImplement } from 'src/notification/infrastructure/query/NotificationQueryImplement';

import { AccountIntegrationEventController } from 'src/notification/interface/integration-event/account-integration-event-controller';
import { NotificationController } from 'src/notification/interface/NotificationController';

import { EmailAdaptor } from 'src/notification/application/adaptor/email-adaptor';
import { SendEmailHandler } from 'src/notification/application/command/SendEmailHandler';
import { FindNotificationHandler } from 'src/notification/application/query/FindNotificationHandler';
import { NotificationQuery } from 'src/notification/application/query/notification-query';

import { NotificationFactory } from 'src/notification/domain/NotificationFactory';
import { NotificationRepository } from 'src/notification/domain/notification-repository';

const infrastructure = [
  {
    provide: EmailAdaptor,
    useClass: EmailAdaptorImplement,
  },
  {
    provide: NotificationRepository,
    useClass: NotificationRepositoryImplement,
  },
  {
    provide: NotificationQuery,
    useClass: NotificationQueryImplement,
  },
];

const application = [SendEmailHandler, FindNotificationHandler];

const domain = [NotificationFactory];

@Module({
  imports: [CqrsModule],
  providers: [...infrastructure, ...application, ...domain],
  controllers: [AccountIntegrationEventController, NotificationController],
})
export class NotificationModule {}
