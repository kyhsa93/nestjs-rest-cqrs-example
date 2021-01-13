import { IEvent } from '@nestjs/cqrs';

export default class AccountOpenedDomainEvent implements IEvent {
  constructor(public readonly id: string) {}
}
