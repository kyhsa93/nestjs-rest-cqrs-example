import { IEvent } from '@nestjs/cqrs';

export class DepositedEvent implements IEvent {
  constructor(readonly accountId: string, readonly email: string) {}
}
