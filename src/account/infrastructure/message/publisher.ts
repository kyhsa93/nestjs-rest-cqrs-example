import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { connect, Options } from 'amqplib';

import AppConfiguration from '@src/app.config';

import { Event, Publisher } from '@src/account/application/event/publisher';

@Injectable()
export default class IntegrationEventPublisher implements Publisher {
  private readonly exchange: string;

  private readonly connectionOptions: Options.Connect;

  constructor() {
    this.exchange = AppConfiguration.rabbitMQ.exchange;
    this.connectionOptions = AppConfiguration.rabbitMQ;
  }

  public async publish(message: Event): Promise<void> {
    const channel = await (await connect(this.connectionOptions)).createChannel();
    await channel.assertExchange(this.exchange, 'topic', { durable: true });
    if (!channel) throw new InternalServerErrorException('cannot get publisher channel');

    channel.publish(this.exchange, message.key, Buffer.from(message.data));
  }
}
