import { IQuery } from '@nestjs/cqrs';

export class FindNotificationQuery implements IQuery {
  readonly skip: number;
  readonly take: number;
  readonly to?: string;
  readonly accountId?: string;

  constructor(options: FindNotificationQuery) {
    Object.assign(this, options);
  }
}
