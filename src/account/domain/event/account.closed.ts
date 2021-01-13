import { IEvent } from '@nestjs/cqrs';

export default class AccountClosedDomainEvent implements IEvent {
  constructor(public readonly id: string) {}
}
