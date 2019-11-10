import { AggregateRoot } from '@nestjs/cqrs';
import bcrypt from 'bcrypt-nodejs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ComparePasswordEvent } from '../../application/event/implements/account.event.compare-password';

export default class Account extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public password: string,
    public readonly active: boolean,
  ) {
    super();
  }

  comparePassword(password: string): boolean {
    const result = bcrypt.compareSync(password, this.password);
    if (result) this.apply(new ComparePasswordEvent(this.id));
    return result;
  }

  updatePassoword(oldPassoword: string, newPassword: string): void {
    if (!this.comparePassword(oldPassoword)) throw new HttpException('Bad requeest', HttpStatus.BAD_REQUEST);
    this.password = bcrypt.hashSync(newPassword);
  }
}
