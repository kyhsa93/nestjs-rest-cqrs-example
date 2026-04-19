import { DiscoveryModule } from '@nestjs-plus/discovery';
import { Global, Module } from '@nestjs/common';

import { EventConsumer } from 'src/outbox/EventConsumer';
import { OutboxRelay } from 'src/outbox/OutboxRelay';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [OutboxWriter, OutboxRelay, EventConsumer],
  exports: [OutboxWriter],
})
export class OutboxModule {}
