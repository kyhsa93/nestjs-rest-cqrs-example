import { IEvent } from '@nestjs/cqrs';

export class AccountClosedEvent implements IEvent {
  constructor(readonly accountId: string, readonly email: string) {}
}
