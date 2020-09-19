import { UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import AccountDeleted from 'src/account/domain/event/account.deleted';
import AccountUpdated from 'src/account/domain/event/account.updated';
import Password from 'src/account/domain/model/password.model';

export default class Account extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private _password: Password,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | undefined,
  ) {
    super();
  }
  
  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get password(): Password {
    return this._password
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  public updatePassword(password: string, data: string): void {
    if (!bcrypt.compareSync(password, this.password.encrypted)) {
      throw new UnauthorizedException();
    }

    this._updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this._password = new Password(bcrypt.hashSync(data, salt), salt, new Date(), new Date());
    this.apply(new AccountUpdated(this.id, this.email));
  }

  public comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password.encrypted);
  }

  public delete(): void {
    this._deletedAt = new Date();
    this.apply(new AccountDeleted(this.id, this.email));
  }
}
