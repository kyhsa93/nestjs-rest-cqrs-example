import { ICommand } from '@nestjs/cqrs';

import { CreateNotificationOptions } from 'src/notification/domain/NotificationFactory';

export class SendEmailCommand implements ICommand {
  readonly accountId: string;
  readonly to: string;
  readonly subject: string;
  readonly content: string;

  constructor(options: Omit<CreateNotificationOptions, 'id'>) {
    Object.assign(this, options);
  }
}
