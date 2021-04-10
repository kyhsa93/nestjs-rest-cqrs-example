import { IEvent } from '@nestjs/cqrs';

export class WithdrawnEvent implements IEvent {
  constructor(readonly id: string) {}
}
