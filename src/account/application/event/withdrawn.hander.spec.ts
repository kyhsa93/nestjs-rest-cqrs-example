import { Logger, ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { WithdrawnHandler } from 'src/account/application/event/withdrawn.handler';
import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/account/application/event/integration';
import { InjectionToken } from 'src/account/application/injection.token';

import { WithdrawnEvent } from 'src/account/domain/event/withdrawn.event';

describe('WithdrawnHandler', () => {
  let handler: WithdrawnHandler;
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
      WithdrawnHandler,
      loggerProvider,
      publisherProvider,
      storeProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(WithdrawnHandler);
    logger = testModule.get(Logger);
    publisher = testModule.get(InjectionToken.INTEGRATION_EVENT_PUBLISHER);
    store = testModule.get(InjectionToken.EVENT_STORE);
  });

  describe('handle', () => {
    it('should handle WithdrawnEvent', async () => {
      logger.log = jest.fn();
      publisher.publish = jest.fn();
      store.save = jest.fn();

      const event = { id: 'accountId' } as WithdrawnEvent;

      await expect(handler.handle(event)).resolves.toEqual(undefined);
      expect(logger.log).toBeCalledTimes(1);
      expect(logger.log).toBeCalledWith(
        `${IntegrationEventSubject.WITHDRAWN}: ${JSON.stringify(event)}`,
      );
      expect(publisher.publish).toBeCalledTimes(1);
      expect(publisher.publish).toBeCalledWith({
        subject: IntegrationEventSubject.WITHDRAWN,
        data: { id: event.id },
      });
      expect(store.save).toBeCalledTimes(1);
      expect(store.save).toBeCalledWith({
        subject: IntegrationEventSubject.WITHDRAWN,
        data: event,
      });
    });
  });
});
