import { Global, Module } from '@nestjs/common';

import { OutboxRelay } from 'src/outbox/OutboxRelay';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

@Global()
@Module({
  providers: [OutboxWriter, OutboxRelay],
  exports: [OutboxWriter],
})
export class OutboxModule {}
