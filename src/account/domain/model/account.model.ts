import { UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';
import { AccountUpdated } from 'src/account/domain/event/account.updated';

import Password from 'src/account/domain/model/password.model';

export default class Account extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private _password: Password,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
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

  public updatePassword(password: string, data: string): void {
    if (!bcrypt.compareSync(password, this._password.encrypted)) {
      throw new UnauthorizedException();
    }

    const salt = bcrypt.genSaltSync();
    this._password = new Password(bcrypt.hashSync(data, salt), salt, new Date(), new Date());
    this.apply(new AccountUpdated(this._id, this._email));
  }

  public comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this._password.encrypted);
  }
}
