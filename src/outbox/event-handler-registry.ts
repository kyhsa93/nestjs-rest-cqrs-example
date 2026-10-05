import { Injectable, Logger } from '@nestjs/common';

type EventHandlerFn = (payload: object) => Promise<void>;

@Injectable()
export class EventHandlerRegistry {
  private readonly logger = new Logger(EventHandlerRegistry.name);
  private readonly handlers = new Map<string, EventHandlerFn[]>();

  register(eventType: string, handler: EventHandlerFn): void {
    const list = this.handlers.get(eventType) ?? [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  has(eventType: string): boolean {
    return this.handlers.has(eventType);
  }

  async handle(eventType: string, payload: object): Promise<void> {
    const errors: unknown[] = [];
    for (const handler of this.handlers.get(eventType) ?? []) {
      try {
        await handler(payload);
      } catch (error) {
        this.logger.error(
          `Event handler failed. eventType: ${eventType}. Error: ${error}`,
        );
        errors.push(error);
      }
    }
    if (errors.length > 0) throw errors[0];
  }
}
