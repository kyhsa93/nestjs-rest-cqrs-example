import { AccountProperties } from 'src/account/domain/account';

export class Event {
  readonly subject: string;
  readonly data: AccountProperties;
}

export class IntegrationEvent {
  readonly subject: string;
  readonly data: Record<string, string>;
}

export interface IntegrationEventPublisher {
  publish: (event: IntegrationEvent) => Promise<void>;
}

export interface EventStore {
  save: (event: Event) => Promise<void>;
}

export enum IntegrationEventSubject {
  OPENED = 'account.opened',
  CLOSED = 'account.closed',
  DEPOSITED = 'account.deposited',
  WITHDRAWN = 'account.withdrawn',
  PASSWORD_UPDATED = 'account.password.updated',
}
