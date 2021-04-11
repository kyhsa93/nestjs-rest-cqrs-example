import {
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

export interface AccountAttributes {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}

export default class Account extends AggregateRoot {
  private readonly id: string;

  private readonly name: string;

  private password: string;

  private balance: number;

  private readonly openedAt: Date;

  private updatedAt: Date;

  private closedAt?: Date;

  constructor(attributes: AccountAttributes) {
    super();
    this.id = attributes.id;
    this.name = attributes.name;
    this.password = attributes.password;
    this.balance = attributes.balance;
    this.openedAt = attributes.openedAt;
    this.updatedAt = attributes.updatedAt;
    this.closedAt = attributes.closedAt;
  }

  attributes(): AccountAttributes {
    return {
      id: this.id,
      name: this.name,
      password: this.password,
      balance: this.balance,
      openedAt: this.openedAt,
      updatedAt: this.updatedAt,
      closedAt: this.closedAt,
    };
  }

  updatePassword(password: string, data: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(data, salt);
    this.apply(new PasswordUpdatedEvent(this.id));
  }

  withdraw(amount: number, password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (amount < 0)
      throw new UnprocessableEntityException('Can not withdraw under 0');
    if (this.balance < amount)
      throw new UnprocessableEntityException(
        'Requested amount exceeds your withdrawal limit',
      );
    this.balance -= amount;
    this.apply(new WithdrawnEvent(this.id));
  }

  deposit(amount: number, password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (amount < 0)
      throw new UnprocessableEntityException('Can not deposit under 0');
    this.balance += amount;
    this.apply(new DepositedEvent(this.id));
  }

  close(password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (this.balance > 0)
      throw new UnprocessableEntityException('Account balance is remained');
    this.closedAt = new Date();
    this.apply(new AccountClosedEvent(this.id));
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
