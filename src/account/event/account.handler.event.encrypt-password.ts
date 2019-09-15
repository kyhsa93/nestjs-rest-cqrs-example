import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EncryptPasswordEvent } from './account.event.encrypt-password';

@EventsHandler(EncryptPasswordEvent)
export class EncryptPasswordEventHandler implements IEventHandler<EncryptPasswordEvent> {

  handle(event: EncryptPasswordEvent) {
    console.log(`password is encrypted! accountId: ${event.accountId}`);
  }
}
