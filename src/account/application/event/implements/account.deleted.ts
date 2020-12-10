import { Event } from '@src/account/application/event/publisher';

export default class AccountDeletedIntegrationEvent implements Event {
  constructor(
    public readonly key: string,
    public readonly data: { readonly id: string; readonly email: string },
  ) {}
}
