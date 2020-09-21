import { IEvent } from '@nestjs/cqrs';

export default class AccountUpdated implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
