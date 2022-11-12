import { IEvent } from '@nestjs/cqrs';

export class WithdrawnEvent implements IEvent {
  constructor(readonly accountId: string, readonly email: string) {}
}
