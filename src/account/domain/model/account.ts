import { UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import AccountDeleted from '@src/account/domain/event/account.deleted';
import AccountUpdated from '@src/account/domain/event/account.updated';
import Password, { AnemicPassword } from '@src/account/domain/model/password';

export interface AnemicAccount {
  readonly id: string;
  readonly email: string;
  readonly password: AnemicPassword;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | undefined;
}

export default class Account extends AggregateRoot {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private password: Password,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | undefined,
  ) {
    super();
  }

  public toAnemic(): AnemicAccount {
    return {
      id: this.id,
      email: this.email,
      password: this.password.toAnemic(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  public async updatePassword(password: string, data: string): Promise<void> {
    if (!(await this.password.compare(password))) {
      throw new UnauthorizedException();
    }

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = new Password(bcrypt.hashSync(data, salt), salt, new Date(), new Date());
    this.apply(new AccountUpdated(this.id, this.email));
  }

  public async comparePassword(password: string): Promise<boolean> {
    return this.password.compare(password);
  }

  public delete(): void {
    this.deletedAt = new Date();
    this.apply(new AccountDeleted(this.id, this.email));
  }

  public deleted(): boolean {
    return !!this.deletedAt;
  }
}
