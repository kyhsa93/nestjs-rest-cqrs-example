import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import ComparePasswordEvent from '../implements/account.event.compare-password';

@EventsHandler(ComparePasswordEvent)
export default class ComparePasswordEventHandler implements IEventHandler<ComparePasswordEvent> {
  public handle = (event: ComparePasswordEvent): void => console.log(`password is compared! id: ${event.id}`);
}
