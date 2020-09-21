import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import AccountDeleted from '@src/account/domain/event/account.deleted';

@EventsHandler(AccountDeleted)
export default class AccountDeletedEventHandler implements IEventHandler<AccountDeleted> {
  public handle = (event: AccountDeleted): void => console.log(`account deleted: ${event}`);
}
