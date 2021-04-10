import { IEvent } from '@nestjs/cqrs';

export class AccountClosedEvent implements IEvent {
  constructor(readonly id: string) {}
}
