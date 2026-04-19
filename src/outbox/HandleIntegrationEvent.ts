import { SetMetadata } from '@nestjs/common';

export const HANDLE_INTEGRATION_EVENT_METADATA = Symbol.for(
  'HANDLE_INTEGRATION_EVENT_METADATA',
);

export type HandleIntegrationEventMetadata = Readonly<{ eventName: string }>;

export const HandleIntegrationEvent = (eventName: string) =>
  SetMetadata<symbol, HandleIntegrationEventMetadata>(
    HANDLE_INTEGRATION_EVENT_METADATA,
    { eventName },
  );
