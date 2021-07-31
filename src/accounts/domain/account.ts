import {
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { ErrorMessage } from 'src/accounts/domain/error';
import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';
import { AccountOpenedEvent } from 'src/accounts/domain/events/account-opened.event';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

export type AccountEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
}>;

export type AccountOptionalProperties = Partial<{
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
  readonly version: number;
}>;

export type AccountProperties = AccountEssentialProperties &
  Required<AccountOptionalProperties>;

export class Account extends AggregateRoot {
  private readonly id: string;
  private readonly name: string;
  private password = '';
  private balance = 0;
  private readonly openedAt: Date = new Date();
  private updatedAt: Date = new Date();
  private closedAt: Date | null = null;
  private version = 0;

  constructor(
    properties: AccountEssentialProperties & AccountOptionalProperties,
  ) {
    super();
    Object.assign(this, properties);
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
      version: this.version,
    };
  }

  open(): void {
    this.apply(Object.assign(new AccountOpenedEvent(), this));
  }

  setPassword(password: string): void {
    if (this.password !== '' || password === '')
      throw new InternalServerErrorException(ErrorMessage.CAN_NOT_SET_PASSWORD);
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(password, salt);
    this.updatedAt = new Date();
  }

  updatePassword(password: string, data: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(data, salt);
    this.apply(Object.assign(new PasswordUpdatedEvent(), this));
  }

  withdraw(amount: number, password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
      );
    if (this.balance < amount)
      throw new UnprocessableEntityException(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
      );
    this.balance -= amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new WithdrawnEvent(), this));
  }

  deposit(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
      );
    this.balance += amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new DepositedEvent(), this));
  }

  close(password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (this.balance > 0)
      throw new UnprocessableEntityException(
        ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED,
      );
    this.closedAt = new Date();
    this.updatedAt = new Date();
    this.apply(Object.assign(new AccountClosedEvent(), this));
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
