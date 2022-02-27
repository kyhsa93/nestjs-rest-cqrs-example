import { Injectable } from '@nestjs/common';
import { Channel, connect, Connection } from 'amqplib';

import { AppService, RabbitMQConfig } from 'src/app.service';

import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from 'src/account/application/event/integration';

@Injectable()
export class IntegrationEventPublisherImplement
  implements IntegrationEventPublisher
{
  private static exchange: string;

  private readonly promisedChannel: Promise<Channel>;

  constructor() {
    const config = AppService.rabbitMQConfig();
    IntegrationEventPublisherImplement.exchange = config.exchange;
    this.promisedChannel = IntegrationEventPublisherImplement.connect(config);
  }

  async publish(message: IntegrationEvent): Promise<void> {
    this.promisedChannel.then((channel) =>
      channel.publish(
        IntegrationEventPublisherImplement.exchange,
        message.subject,
        Buffer.from(JSON.stringify(message.data)),
      ),
    );
  }

  private static async connect(config: RabbitMQConfig): Promise<Channel> {
    return connect(config)
      .then(IntegrationEventPublisherImplement.createChannel)
      .then(IntegrationEventPublisherImplement.assertExchange)
      .catch(() => IntegrationEventPublisherImplement.connect(config));
  }

  private static async createChannel(connection: Connection): Promise<Channel> {
    return connection.createChannel();
  }

  private static async assertExchange(channel: Channel): Promise<Channel> {
    await channel.assertExchange(
      IntegrationEventPublisherImplement.exchange,
      'topic',
      {
        durable: true,
      },
    );
    return channel;
  }
}
