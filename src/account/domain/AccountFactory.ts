import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  Account,
  AccountImplement,
  AccountProperties,
} from 'src/account/domain/Account';

type CreateAccountOptions = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string;
}>;

export class AccountFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateAccountOptions): Account {
    return this.eventPublisher.mergeObjectContext(
      new AccountImplement({
        ...options,
        balance: 0,
        lockedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 0,
      }),
    );
  }

  reconstitute(properties: AccountProperties): Account {
    return this.eventPublisher.mergeObjectContext(
      new AccountImplement(properties),
    );
  }
}
