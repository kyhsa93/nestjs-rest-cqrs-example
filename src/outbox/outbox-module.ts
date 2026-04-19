import { DiscoveryModule } from '@nestjs-plus/discovery';
import { Global, Module } from '@nestjs/common';

import { EventConsumer } from 'src/outbox/event-consumer';
import { OutboxRelay } from 'src/outbox/outbox-relay';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [OutboxWriter, OutboxRelay, EventConsumer],
  exports: [OutboxWriter],
})
export class OutboxModule {}
