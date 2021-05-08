import { IEvent } from '@nestjs/cqrs';

export class PasswordUpdatedEvent implements IEvent {
  constructor(readonly id: string) {}
}
