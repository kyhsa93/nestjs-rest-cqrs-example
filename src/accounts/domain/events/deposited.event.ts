import { IEvent } from '@nestjs/cqrs';

export class DepositedEvent implements IEvent {
  constructor(readonly id: string) {}
}
