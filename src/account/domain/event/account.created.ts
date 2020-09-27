import { IEvent } from '@nestjs/cqrs';

export default class AccountCreatedDomainEvent implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
