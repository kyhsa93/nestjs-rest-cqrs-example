import { IEvent } from '@nestjs/cqrs';

export default class AccountUpdatedDomainEvent implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
