import { IEvent } from '@nestjs/cqrs';

export class AccountOpenedEvent implements IEvent {
  constructor(readonly id: string) {}
}
