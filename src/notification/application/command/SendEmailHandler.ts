import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from 'libs/Transactional';
import { EmailAdaptor } from 'src/notification/application/adaptor/EmailAdaptor';

import { SendEmailCommand } from 'src/notification/application/command/SendEmailCommand';
import { InjectionToken } from 'src/notification/application/InjectionToken';

import { NotificationFactory } from 'src/notification/domain/NotificationFactory';
import { NotificationRepository } from 'src/notification/domain/NotificationRepository';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler
  implements ICommandHandler<SendEmailCommand, void>
{
  @Inject() private readonly notificationFactory: NotificationFactory;
  @Inject(InjectionToken.NOTIFICATION_REPOSITORY)
  private readonly notificationRepository: NotificationRepository;
  @Inject(InjectionToken.EMAIL_ADAPTOR)
  private readonly emailAdaptor: EmailAdaptor;

  @Transactional()
  async execute(command: SendEmailCommand): Promise<void> {
    const notification = this.notificationFactory.create({
      ...command,
      id: this.notificationRepository.newId(),
    });
    await this.notificationRepository.save(notification);
    await this.emailAdaptor.sendEmail(
      command.to,
      command.subject,
      command.content,
    );
  }
}
