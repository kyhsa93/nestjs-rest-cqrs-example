import { Logger, ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InvoiceOpenedHandler } from 'src/invoices/application/events/invoice-opened.handler';
import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/invoices/application/events/integration';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceOpenedEvent } from 'src/invoices/domain/events/invoice-opened.event';

describe('InvoiceOpenedHandler', () => {
  let handler: InvoiceOpenedHandler;
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
      InvoiceOpenedHandler,
      loggerProvider,
      publisherProvider,
      storeProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(InvoiceOpenedHandler);
    logger = testModule.get(Logger);
    publisher = testModule.get(InjectionToken.INTEGRATION_EVENT_PUBLISHER);
    store = testModule.get(InjectionToken.EVENT_STORE);
  });

  describe('handle', () => {
    it('should handle InvoiceOpenedEvent', async () => {
      logger.log = jest.fn();
      publisher.publish = jest.fn();
      store.save = jest.fn();

      const event = { id: 'invoiceId' } as InvoiceOpenedEvent;

      await expect(handler.handle(event)).resolves.toEqual(undefined);
      expect(logger.log).toBeCalledTimes(1);
      expect(logger.log).toBeCalledWith(
        `${IntegrationEventSubject.OPENED}: ${JSON.stringify(event)}`,
      );
      expect(publisher.publish).toBeCalledTimes(1);
      expect(publisher.publish).toBeCalledWith({
        subject: IntegrationEventSubject.OPENED,
        data: { id: event.id },
      });
      expect(store.save).toBeCalledTimes(1);
      expect(store.save).toBeCalledWith({
        subject: IntegrationEventSubject.OPENED,
        data: event,
      });
    });
  });
});
