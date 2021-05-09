import { AccountProperties } from 'src/accounts/domain/account';

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
