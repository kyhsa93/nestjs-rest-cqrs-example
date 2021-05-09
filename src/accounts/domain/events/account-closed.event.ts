import { IEvent } from '@nestjs/cqrs';

import { AccountProperties } from 'src/accounts/domain/account';

export class AccountClosedEvent implements IEvent, AccountProperties {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}
