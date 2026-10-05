import { CacheModule } from '@nestjs/cache-manager';
import { Global, INestApplication, Module } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { ENTITY_ID_TRANSFORMER } from 'libs/database/database-module';
import {
  AccountClosed,
  AccountDeposited,
  AccountOpened,
  AccountPasswordUpdated,
  AccountWithdrawn,
  TASK_PUBLISHER,
} from 'libs/message/message-module';

import { AccountsModule } from 'src/account/accounts-module';
import { AccountClosedHandler } from 'src/account/application/event/account-closed-handler';
import { AccountOpenedHandler } from 'src/account/application/event/account-opened-handler';
import { DepositedHandler } from 'src/account/application/event/deposited-handler';
import { PasswordUpdatedHandler } from 'src/account/application/event/password-updated-handler';
import { WithdrawnHandler } from 'src/account/application/event/withdrawn-handler';
import { NotificationModule } from 'src/notification/notification-module';
import { AccountIntegrationEventController } from 'src/notification/interface/integration-event/account-integration-event-controller';
import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';
import { HANDLE_EVENT_METADATA } from 'src/outbox/handle-event';
import { HANDLE_INTEGRATION_EVENT_METADATA } from 'src/outbox/handle-integration-event';
import { OutboxModule } from 'src/outbox/outbox-module';
import { OutboxWriter } from 'src/outbox/outbox-writer';

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}));
jest.mock('src/config', () => ({
  Config: { AWS_REGION: 'ap-northeast-2' },
}));

@Global()
@Module({
  providers: [
    { provide: TASK_PUBLISHER, useValue: {} },
    { provide: ENTITY_ID_TRANSFORMER, useValue: {} },
  ],
  exports: [TASK_PUBLISHER, ENTITY_ID_TRANSFORMER],
})
class StubInfrastructureModule {}

const decoratedRoutes = (
  type: new (...args: never[]) => object,
  metadataKey: symbol,
) =>
  Object.getOwnPropertyNames(type.prototype)
    .map((method) => ({
      method,
      meta: Reflect.getMetadata(
        metadataKey,
        (type.prototype as Record<string, object>)[method],
      ) as Record<string, string> | undefined,
    }))
    .filter(
      (entry): entry is { method: string; meta: Record<string, string> } =>
        entry.meta !== undefined,
    )
    .map(({ method, meta }) => ({
      method,
      eventType: Object.values(meta)[0],
    }));

describe('Outbox event routing', () => {
  let app: INestApplication;
  let registry: EventHandlerRegistry;
  const saveAll = jest.fn().mockResolvedValue(undefined);
  let execute: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CacheModule.register({ isGlobal: true }),
        StubInfrastructureModule,
        OutboxModule,
        AccountsModule,
        NotificationModule,
      ],
    })
      .overrideProvider(OutboxWriter)
      .useValue({ saveAll })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    registry = app.get(EventHandlerRegistry);
    execute = jest
      .spyOn(app.get(CommandBus), 'execute')
      .mockResolvedValue(undefined);
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    saveAll.mockClear();
    execute.mockClear();
  });

  it.each([
    [AccountOpenedHandler, HANDLE_EVENT_METADATA],
    [PasswordUpdatedHandler, HANDLE_EVENT_METADATA],
    [AccountClosedHandler, HANDLE_EVENT_METADATA],
    [DepositedHandler, HANDLE_EVENT_METADATA],
    [WithdrawnHandler, HANDLE_EVENT_METADATA],
    [AccountIntegrationEventController, HANDLE_INTEGRATION_EVENT_METADATA],
  ])(
    'routes every eventType declared on %p to the same decorated method',
    async (type, metadataKey) => {
      const routes = decoratedRoutes(
        type as new (...args: never[]) => object,
        metadataKey,
      );
      expect(routes.length).toBeGreaterThan(0);

      const instance = app.get(type as never) as Record<string, jest.Mock>;
      for (const { method, eventType } of routes) {
        const spy = jest
          .spyOn(instance, method)
          .mockResolvedValue(undefined as never);
        await registry.handle(eventType, { accountId: 'a', email: 'e' });
        expect(spy).toHaveBeenCalledWith({ accountId: 'a', email: 'e' });
        spy.mockRestore();
      }
    },
  );

  it.each([
    ['AccountOpenedEvent', AccountOpened],
    ['PasswordUpdatedEvent', AccountPasswordUpdated],
    ['AccountClosedEvent', AccountClosed],
    ['DepositedEvent', AccountDeposited],
    ['WithdrawnEvent', AccountWithdrawn],
  ])(
    '%s writes the matching integration event to the outbox',
    async (eventType, integrationEvent) => {
      await registry.handle(eventType, { accountId: 'a', email: 'e' });

      expect(saveAll).toHaveBeenCalledWith([new integrationEvent('a', 'e')]);
    },
  );

  it.each([
    ['AccountOpened', 'New account created'],
    ['AccountPasswordUpdated', 'Account password updated'],
    ['AccountClosed', 'Account closed'],
    ['AccountDeposited', 'Deposited'],
    ['AccountWithdrawn', 'Withdrawn'],
  ])('%s sends the "%s" email', async (eventType, subject) => {
    await registry.handle(eventType, { accountId: 'a', email: 'e' });

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({ accountId: 'a', to: 'e', subject }),
    );
  });
});
