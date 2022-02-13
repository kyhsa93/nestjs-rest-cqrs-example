import { Logger, ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InvoiceClosedHandler } from 'src/invoices/application/events/invoice-closed.handler';
import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/invoices/application/events/integration';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceClosedEvent } from 'src/invoices/domain/events/invoice-closed.event';

describe('InvoiceClosedHandler', () => {
  let handler: InvoiceClosedHandler;
  let logger: Logger;
  let publisher: IntegrationEventPublisher;
  let store: EventStore;

  beforeEach(async () => {
    const loggerProvider: Provider = {
      provide: Logger,
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
      useValue: {},
    };
    const storeProvider: Provider = {
      provide: InjectionToken.EVENT_STORE,
      useValue: {},
    };
    const providers: Provider[] = [
      InvoiceClosedHandler,
      loggerProvider,
      publisherProvider,
      storeProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(InvoiceClosedHandler);
    logger = testModule.get(Logger);
    publisher = testModule.get(InjectionToken.INTEGRATION_EVENT_PUBLISHER);
    store = testModule.get(InjectionToken.EVENT_STORE);
  });

  describe('handle', () => {
    it('should handle InvoiceClosedEvent', async () => {
      logger.log = jest.fn();
      publisher.publish = jest.fn();
      store.save = jest.fn();

      const event = { id: 'invoiceId' } as InvoiceClosedEvent;

      await expect(handler.handle(event)).resolves.toEqual(undefined);
      expect(logger.log).toBeCalledTimes(1);
      expect(logger.log).toBeCalledWith(
        `${IntegrationEventSubject.CLOSED}: ${JSON.stringify(event)}`,
      );
      expect(publisher.publish).toBeCalledTimes(1);
      expect(publisher.publish).toBeCalledWith({
        subject: IntegrationEventSubject.CLOSED,
        data: { id: event.id },
      });
      expect(store.save).toBeCalledTimes(1);
      expect(store.save).toBeCalledWith({
        subject: IntegrationEventSubject.CLOSED,
        data: event,
      });
    });
  });
});
