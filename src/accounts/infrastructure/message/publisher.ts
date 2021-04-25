import { Injectable } from '@nestjs/common';
import { Channel, connect, Connection, Replies } from 'amqplib';

import { AppService } from 'src/app.service';

import { Event, Publisher } from 'src/accounts/application/events/integration';

@Injectable()
export class IntegrationEventPublisher implements Publisher {
  private readonly exchange: string;

  private readonly channel;

  constructor() {
    const config = AppService.rabbitMQConfig();
    this.exchange = config.exchange;
    this.channel = connect(config)
      .then(this.createChannel)
      .catch(this.failToConnectRabbitMQ);
  }

  async publish(message: Event): Promise<void> {
    this.channel.publish(
      this.exchange,
      message.subject,
      Buffer.from(JSON.stringify(message.data)),
    );
  }

  private createChannel(
    connection: Connection,
  ): Promise<Replies.AssertExchange> {
    return connection.createChannel().then(this.assertExchange);
  }

  private assertExchange(channel: Channel): Promise<Replies.AssertExchange> {
    return channel.assertExchange(this.exchange, 'topic', { durable: true });
  }

  private failToConnectRabbitMQ(error: Error): void {
    console.error(error);
    process.exit(1);
  }
}
