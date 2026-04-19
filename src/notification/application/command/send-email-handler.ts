import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from 'libs/transactional';

import { EmailAdaptor } from 'src/notification/application/adaptor/email-adaptor';
import { SendEmailCommand } from 'src/notification/application/command/send-email-command';

import { NotificationFactory } from 'src/notification/domain/notification-factory';
import { NotificationRepository } from 'src/notification/domain/notification-repository';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<
  SendEmailCommand,
  void
> {
  constructor(
    private readonly notificationFactory: NotificationFactory,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailAdaptor: EmailAdaptor,
  ) {}

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
