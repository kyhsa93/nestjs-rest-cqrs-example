import { IEvent } from '@nestjs/cqrs';

export class PasswordUpdatedEvent implements IEvent {
  constructor(readonly accountId: string, readonly email: string) {}
}
