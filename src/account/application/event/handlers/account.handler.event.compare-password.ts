import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ComparePasswordEvent } from '../implements/account.event.compare-password';

@EventsHandler(ComparePasswordEvent)
export class ComparePasswordEventHandler implements IEventHandler<ComparePasswordEvent> {

  handle(event: ComparePasswordEvent): void {
    return console.log(`password is compared! accountId: ${event.accountId}`);
  }
}
