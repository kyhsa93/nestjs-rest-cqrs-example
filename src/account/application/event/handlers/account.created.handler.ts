import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import AccountCreated from '@src/account/domain/event/account.created';

@EventsHandler(AccountCreated)
export default class AccountCreatedEventHandler implements IEventHandler<AccountCreated> {
  public handle = (event: AccountCreated): void => console.log(`account created: ${event}`);
}
