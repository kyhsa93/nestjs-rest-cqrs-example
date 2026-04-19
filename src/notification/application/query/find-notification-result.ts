import { IQueryResult } from '@nestjs/cqrs';

export class FindNotificationResult implements IQueryResult {
  constructor(
    readonly notifications: Readonly<{
      id: string;
      to: string;
      subject: string;
      content: string;
      createdAt: Date;
    }>[],
  ) {}
}
