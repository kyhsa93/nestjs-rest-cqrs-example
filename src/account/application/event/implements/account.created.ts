import { Event } from '@src/account/application/event/publisher';

export default class AccountCreatedIntegrationEvent implements Event {
  constructor(
    public readonly key: string,
    public readonly data: { readonly id: string; email: string },
  ) {}
}
