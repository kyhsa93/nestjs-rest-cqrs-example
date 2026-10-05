import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';

describe('EventHandlerRegistry', () => {
  let registry: EventHandlerRegistry;

  beforeEach(() => {
    registry = new EventHandlerRegistry();
  });

  it('calls every handler registered for the same eventType', async () => {
    const first = jest.fn().mockResolvedValue(undefined);
    const second = jest.fn().mockResolvedValue(undefined);
    registry.register('SomeEvent', first);
    registry.register('SomeEvent', second);

    await registry.handle('SomeEvent', { some: 'payload' });

    expect(first).toHaveBeenCalledWith({ some: 'payload' });
    expect(second).toHaveBeenCalledWith({ some: 'payload' });
  });

  it('still calls the other handlers when one throws, then rethrows', async () => {
    const failing = jest.fn().mockRejectedValue(new Error('boom'));
    const succeeding = jest.fn().mockResolvedValue(undefined);
    registry.register('SomeEvent', failing);
    registry.register('SomeEvent', succeeding);

    await expect(registry.handle('SomeEvent', {})).rejects.toThrow('boom');
    expect(succeeding).toHaveBeenCalled();
  });

  it('resolves without error when no handler is registered', async () => {
    expect(registry.has('UnregisteredEvent')).toBe(false);
    await expect(
      registry.handle('UnregisteredEvent', {}),
    ).resolves.toBeUndefined();
  });
});
