import { Global, Module } from '@nestjs/common';

import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';
import { OutboxConsumer } from 'src/outbox/outbox-consumer';
import { OutboxPoller } from 'src/outbox/outbox-poller';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Global()
@Module({
  providers: [OutboxWriter, EventHandlerRegistry, OutboxPoller, OutboxConsumer],
  exports: [OutboxWriter, EventHandlerRegistry],
})
export class OutboxModule {}
