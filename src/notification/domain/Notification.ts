import { AggregateRoot } from '@nestjs/cqrs';

export type NotificationProperties = Readonly<{
  id: string;
  accountId: string;
  to: string;
  subject: string;
  content: string;
  createdAt: Date;
}>;

export class Notification extends AggregateRoot {
  private readonly id: string;
  private readonly accountId: string;
  private readonly to: string;
  private readonly subject: string;
  private readonly content: string;
  private readonly createdAt: Date;

  constructor(properties: NotificationProperties) {
    super();
    Object.assign(this, properties);
  }
}
