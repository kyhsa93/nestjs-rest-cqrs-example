import { OutboxConsumer } from 'src/outbox/outbox-consumer';
import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}));
jest.mock('src/config', () => ({
  Config: {
    AWS_REGION: 'ap-northeast-2',
    SQS_DOMAIN_EVENT_QUEUE_URL: 'http://localhost/queue/domain-event',
  },
}));

describe('OutboxConsumer', () => {
  let consumer: OutboxConsumer;
  let registry: EventHandlerRegistry;
  let send: jest.Mock;

  const receive = (body: string) =>
    send.mockImplementation((command: { constructor: { name: string } }) =>
      Promise.resolve(
        command.constructor.name === 'ReceiveMessageCommand'
          ? { Messages: [{ Body: body, ReceiptHandle: 'receipt' }] }
          : {},
      ),
    );
  const deleted = () =>
    send.mock.calls.filter(
      ([command]: [{ constructor: { name: string } }]) =>
        command.constructor.name === 'DeleteMessageCommand',
    ).length;
  const outboxBody = (eventType: string, payload: object) =>
    JSON.stringify({
      eventId: 'id',
      eventType,
      payload: JSON.stringify(payload),
    });

  beforeEach(() => {
    registry = new EventHandlerRegistry();
    consumer = new OutboxConsumer();
    send = jest.fn();
    Object.assign(consumer, { registry, sqsClient: { send } });
  });

  it('routes the payload to the registered handler and deletes the message', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    registry.register('AccountOpenedEvent', handler);
    receive(outboxBody('AccountOpenedEvent', { accountId: 'a', email: 'e' }));

    await consumer.consume();

    expect(handler).toHaveBeenCalledWith({ accountId: 'a', email: 'e' });
    expect(deleted()).toBe(1);
  });

  it('unwraps an SNS envelope before routing', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    registry.register('AccountOpened', handler);
    receive(
      JSON.stringify({
        Message: outboxBody('AccountOpened', { accountId: 'a' }),
      }),
    );

    await consumer.consume();

    expect(handler).toHaveBeenCalledWith({ accountId: 'a' });
    expect(deleted()).toBe(1);
  });

  it('keeps the message for redelivery when the handler fails', async () => {
    registry.register(
      'AccountOpenedEvent',
      jest.fn().mockRejectedValue(new Error('boom')),
    );
    receive(outboxBody('AccountOpenedEvent', {}));

    await consumer.consume();

    expect(deleted()).toBe(0);
  });

  it('deletes a message with no registered handler', async () => {
    receive(outboxBody('UnknownEvent', {}));

    await consumer.consume();

    expect(deleted()).toBe(1);
  });
});
