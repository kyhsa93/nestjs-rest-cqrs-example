import { Injectable } from '@nestjs/common';
import { Channel, connect, Connection } from 'amqplib';

import { AppService, RabbitMQConfig } from 'src/app.service';

import { Event, Publisher } from 'src/accounts/application/events/integration';

@Injectable()
export class IntegrationEventPublisher implements Publisher {
  private static exchange: string;

  private readonly promisedChannel: Promise<Channel>;

  constructor() {
    const config = AppService.rabbitMQConfig();
    IntegrationEventPublisher.exchange = config.exchange;
    this.promisedChannel = IntegrationEventPublisher.connect(config);
  }

  async publish(message: Event): Promise<void> {
    this.promisedChannel.then((channel) =>
      channel.publish(
        IntegrationEventPublisher.exchange,
        message.subject,
        Buffer.from(JSON.stringify(message.data)),
      ),
    );
  }

  private static async connect(config: RabbitMQConfig): Promise<Channel> {
    return connect(config)
      .then(IntegrationEventPublisher.createChannel)
      .then(IntegrationEventPublisher.assertExchange)
      .catch(() => IntegrationEventPublisher.connect(config));
  }

  private static async createChannel(connection: Connection): Promise<Channel> {
    return connection.createChannel();
  }

  private static async assertExchange(channel: Channel): Promise<Channel> {
    await channel.assertExchange(IntegrationEventPublisher.exchange, 'topic', {
      durable: true,
    });
    return channel;
  }
}
