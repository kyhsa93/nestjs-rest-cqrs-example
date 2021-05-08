import {
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';
import { AccountOpenedEvent } from 'src/accounts/domain/events/account-opened.event';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

export interface AccountProperties {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}

export class Account extends AggregateRoot {
  private readonly id: string;

  private readonly name: string;

  private password: string;

  private balance: number;

  private readonly openedAt: Date;

  private updatedAt: Date;

  private closedAt?: Date;

  constructor(properties: AccountProperties) {
    super();
    this.id = properties.id;
    this.name = properties.name;
    this.password = properties.password;
    this.balance = properties.balance;
    this.openedAt = properties.openedAt;
    this.updatedAt = properties.updatedAt;
    this.closedAt = properties.closedAt;
  }

  properties(): AccountProperties {
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

  open(): void {
    this.apply(new AccountOpenedEvent(this.id));
  }

  setPassword(password: string): void {
    if (this.password !== '' || password === '')
      throw new InternalServerErrorException('Can not set password');
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(password, salt);
    this.updatedAt = new Date();
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
    if (amount < 1)
      throw new InternalServerErrorException('Can not withdraw under 1');
    if (this.balance < amount)
      throw new UnprocessableEntityException(
        'Requested amount exceeds your withdrawal limit',
      );
    this.balance -= amount;
    this.apply(new WithdrawnEvent(this.id));
  }

  deposit(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException('Can not deposit under 1');
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
