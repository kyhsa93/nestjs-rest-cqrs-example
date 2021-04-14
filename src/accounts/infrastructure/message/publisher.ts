import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { connect, Options } from 'amqplib';
import { Event, Publisher } from 'src/accounts/application/events/integration';

import { AppService } from 'src/app.service';

@Injectable()
export default class IntegrationEventPublisher implements Publisher {
  private readonly exchange: string;

  private readonly connectionOptions: Options.Connect;

  constructor() {
    const config = AppService.rabbitMQConfig();
    this.exchange = config.exchange;
    this.connectionOptions = config;
  }

  public async publish(message: Event): Promise<void> {
    const channel = await (
      await connect(this.connectionOptions)
    ).createChannel();
    await channel.assertExchange(this.exchange, 'topic', { durable: true });
    if (!channel)
      throw new InternalServerErrorException('Cannot get publisher channel');

    channel.publish(
      this.exchange,
      message.subject,
      Buffer.from(JSON.stringify(message.data)),
    );
  }
}
