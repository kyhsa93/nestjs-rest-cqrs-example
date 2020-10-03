import Message from '@src/account/infrastructure/message/message';

export default class AccountUpdatedIntegrationEvent implements Message {
  constructor(public readonly key: string, public readonly data: string) {}
}
