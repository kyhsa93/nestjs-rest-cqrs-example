import { InvoiceProperties } from 'src/invoices/domain/entity/invoice';

export class Event {
  readonly subject: string;
  readonly data: InvoiceProperties;
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
  OPENED = 'invoice.opened',
  CLOSED = 'invoice.closed',
  DEPOSITED = 'invoice.deposited',
  WITHDRAWN = 'invoice.withdrawn',
  PASSWORD_UPDATED = 'invoice.password.updated',
}
