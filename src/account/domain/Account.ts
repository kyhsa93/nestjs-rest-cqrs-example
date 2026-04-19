import { throwError } from 'libs/ThrowError';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';
import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';
import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';
import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';
import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';

export type AccountEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
    email: string;
  }>
>;

export type AccountOptionalProperties = Readonly<
  Partial<{
    password: string;
    balance: number;
    lockedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    version: number;
  }>
>;

export type AccountProperties = AccountEssentialProperties &
  Required<AccountOptionalProperties>;

export interface Account {
  compareId: (id: string) => boolean;
  open: () => void;
  updatePassword: (password: string) => void;
  withdraw: (amount: number) => void;
  deposit: (amount: number) => void;
  close: () => void;
  lock: () => void;
  readonly domainEvents: ReadonlyArray<object>;
  clearEvents: () => void;
}

export class AccountImplement implements Account {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;
  private password: string;
  private balance: number;
  private lockedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;
  private version: number;
  private readonly _events: object[] = [];

  constructor(properties: AccountProperties) {
    Object.assign(this, properties);
  }

  get domainEvents(): ReadonlyArray<object> {
    return [...this._events];
  }

  clearEvents(): void {
    this._events.length = 0;
  }

  compareId(id: string): boolean {
    return id === this.id;
  }

  open(): void {
    this._events.push(new AccountOpenedEvent(this.id, this.email));
  }

  updatePassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();
    this._events.push(new PasswordUpdatedEvent(this.id, this.email));
  }

  withdraw(amount: number): void {
    if (amount < 1) throwError(ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1);
    if (this.balance < amount)
      throwError(ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT);
    this.balance -= amount;
    this.updatedAt = new Date();
    this._events.push(new WithdrawnEvent(this.id, this.email));
  }

  deposit(amount: number): void {
    if (amount < 1) throwError(ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1);
    this.balance += amount;
    this.updatedAt = new Date();
    this._events.push(new DepositedEvent(this.id, this.email));
  }

  close(): void {
    if (this.balance > 0) throwError(ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED);
    this.deletedAt = new Date();
    this.updatedAt = new Date();
    this._events.push(new AccountClosedEvent(this.id, this.email));
  }

  lock(): void {
    if (this.lockedAt) throwError(ErrorMessage.ACCOUNT_IS_ALREADY_LOCKED);
    this.lockedAt = new Date();
    this.updatedAt = new Date();
    this.version += 1;
  }
}
