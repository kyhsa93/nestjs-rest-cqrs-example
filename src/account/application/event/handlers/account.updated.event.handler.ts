import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import AccountUpdated from '@src/account/domain/event/account.updated';

@EventsHandler(AccountUpdated)
export default class AccountUpdatedEventHandler implements IEventHandler<AccountUpdated> {
  public handle = (event: AccountUpdated): void => console.log(`account updated: ${event}`);
}
