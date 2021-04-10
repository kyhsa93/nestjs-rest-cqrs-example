import { UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import AccountClosed from '@src/account/domain/event/account.closed';
import AccountUpdated from '@src/account/domain/event/account.updated';
import Password, { PasswordAttributes } from '@src/account/domain/model/password';

interface AccountAttribute {
  readonly id: string;
  readonly name: string;
  readonly password: Password;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | undefined;
}

export interface AccountAttributes {
  readonly id: string;
  readonly name: string;
  readonly password: PasswordAttributes;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | undefined;
}

export default class Account extends AggregateRoot {
  private readonly id: string;

  private readonly name: string;

  private password: Password;

  private balance: number;

  private readonly openedAt: Date;

  private updatedAt: Date;

  private closedAt: Date | undefined;

  constructor(attributes: AccountAttribute) {
    super();
    this.id = attributes.id;
    this.name = attributes.name;
    this.password = attributes.password;
    this.balance = attributes.balance;
    this.openedAt = attributes.openedAt;
    this.updatedAt = attributes.updatedAt;
    this.closedAt = attributes.closedAt;
  }

  public attributes(): AccountAttributes {
    return {
      id: this.id,
      name: this.name,
      password: this.password.attributes(),
      balance: this.balance,
      openedAt: this.openedAt,
      updatedAt: this.updatedAt,
      closedAt: this.closedAt,
    };
  }

  public updatePassword(password: string, data: string): void {
    if (!(this.comparePassword(password))) {
      throw new UnauthorizedException();
    }

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = new Password({
      encrypted: bcrypt.hashSync(data, salt),
      salt,
      createdAt: new Date(),
      comparedAt: new Date(),
    });
    this.apply(new AccountUpdated(this.id));
  }

  public withdraw(amount: number, password: string): void {
    if (!(this.comparePassword(password))) {
      throw new UnauthorizedException();
    }
    if (amount < 0) {
      throw new UnprocessableEntityException('Can not withdraw under 0');
    }
    if (this.balance < amount) {
      throw new UnprocessableEntityException('Requested amount exceeds your withdrawal limit');
    }
    this.balance -= amount;
    this.apply(new AccountUpdated(this.id));
  }

  public deposit(amount: number, password: string): void {
    if (!(this.comparePassword(password))) {
      throw new UnauthorizedException();
    }
    if (amount < 0) {
      throw new UnprocessableEntityException('Can not deposit under 0');
    }
    this.balance += amount;
    this.apply(new AccountUpdated(this.id));
  }

  public close(password: string): void {
    if (!(this.comparePassword(password))) {
      throw new UnauthorizedException();
    }
    if (this.balance > 0) {
      throw new UnprocessableEntityException('Account balance is remained');
    }
    this.closedAt = new Date();
    this.apply(new AccountClosed(this.id));
  }

  private comparePassword(password: string): boolean {
    return this.password.compare(password);
  }
}
