import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { connect, Options } from 'amqplib';

import AppConfiguration from '@src/app.config';
import Message from '@src/account/infrastructure/message/message';

@Injectable()
export default class IntegrationEventPublisher {
  private readonly exchange: string;

  private readonly connectionOptions: Options.Connect;

  constructor() {
    this.exchange = AppConfiguration.rabbitMQ.exchange;
    this.connectionOptions = AppConfiguration.rabbitMQ;
  }

  public async publish(message: Message): Promise<void> {
    const channel = await (await connect(this.connectionOptions)).createChannel();
    await channel.assertExchange(this.exchange, 'topic', { durable: true });
    if (!channel) throw new InternalServerErrorException('cannot get publisher channel');

    channel.publish(this.exchange, message.key, Buffer.from(message.data));
  }
}
