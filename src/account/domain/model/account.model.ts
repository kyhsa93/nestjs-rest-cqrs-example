import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt-nodejs';
import { ComparePasswordEvent } from '../../application/event/account.event.compare-password';

export class Account extends AggregateRoot {
  constructor(
    private readonly _accountId: string,
    private readonly _name: string,
    private readonly _email: string,
    private _password: string,
    private readonly _active: boolean,
  ) {
    super();
  }

  comparePassword(password: string): boolean {
    const result = bcrypt.compareSync(password, this._password);
    if (result) this.apply(new ComparePasswordEvent(this._accountId));
    return result;
  }

  get accountId(): string {
    return this._accountId;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
  
  get password(): string {
    return this._password;
  }

  set password(password) {
    this._password = password;
  }

  get active(): boolean {
    return this._active;
  }
}
