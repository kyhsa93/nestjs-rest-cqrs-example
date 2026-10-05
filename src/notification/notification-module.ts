import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EmailAdaptorImplement } from 'src/notification/infrastructure/adaptor/email-adaptor-implement';
import { NotificationRepositoryImplement } from 'src/notification/infrastructure/repository/notification-repository-impl';
import { NotificationQueryImplement } from 'src/notification/infrastructure/query/notification-query-implement';

import { AccountIntegrationEventController } from 'src/notification/interface/integration-event/account-integration-event-controller';
import { NotificationController } from 'src/notification/interface/notification-controller';

import { EmailAdaptor } from 'src/notification/application/adaptor/email-adaptor';
import { SendEmailHandler } from 'src/notification/application/command/send-email-handler';
import { FindNotificationHandler } from 'src/notification/application/query/find-notification-handler';
import { NotificationQuery } from 'src/notification/application/query/notification-query';

import { NotificationFactory } from 'src/notification/domain/notification-factory';
import { NotificationRepository } from 'src/notification/domain/notification-repository';

import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';

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

const interfaces = [AccountIntegrationEventController];

const application = [SendEmailHandler, FindNotificationHandler];

const domain = [NotificationFactory];

@Module({
  imports: [CqrsModule],
  providers: [...infrastructure, ...interfaces, ...application, ...domain],
  controllers: [NotificationController],
})
export class NotificationModule implements OnModuleInit {
  @Inject() private readonly registry: EventHandlerRegistry;
  @Inject()
  private readonly accountIntegrationEventController: AccountIntegrationEventController;

  onModuleInit(): void {
    this.registry.register('AccountOpened', (payload) =>
      this.accountIntegrationEventController.sendNewAccountEmail(
        payload as never,
      ),
    );
    this.registry.register('AccountPasswordUpdated', (payload) =>
      this.accountIntegrationEventController.sendPasswordUpdatedEmail(
        payload as never,
      ),
    );
    this.registry.register('AccountClosed', (payload) =>
      this.accountIntegrationEventController.sendAccountClosedEmail(
        payload as never,
      ),
    );
    this.registry.register('AccountDeposited', (payload) =>
      this.accountIntegrationEventController.sendDepositEmail(payload as never),
    );
    this.registry.register('AccountWithdrawn', (payload) =>
      this.accountIntegrationEventController.sendWithdrawnEmail(
        payload as never,
      ),
    );
  }
}
