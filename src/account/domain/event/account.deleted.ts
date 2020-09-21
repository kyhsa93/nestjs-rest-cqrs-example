import { IEvent } from '@nestjs/cqrs';

export default class AccountDeleted implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
