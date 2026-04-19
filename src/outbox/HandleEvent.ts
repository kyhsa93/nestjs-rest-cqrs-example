import { SetMetadata } from '@nestjs/common';

export const HANDLE_EVENT_METADATA = Symbol.for('HANDLE_EVENT_METADATA');

export type HandleEventMetadata = Readonly<{ eventType: string }>;

export const HandleEvent = (eventType: string) =>
  SetMetadata<symbol, HandleEventMetadata>(HANDLE_EVENT_METADATA, {
    eventType,
  });
