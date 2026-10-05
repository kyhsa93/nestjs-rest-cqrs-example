import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { RequestStorage } from 'libs/database/request-storage';

import { Config } from 'src/config';
import { EventHandlerRegistry } from 'src/outbox/event-handler-registry';

type OutboxMessage = Readonly<{
  eventId: string;
  eventType: string;
  payload: string;
}>;

@Injectable()
export class OutboxConsumer {
  private readonly logger = new Logger(OutboxConsumer.name);
  @Inject() private readonly registry: EventHandlerRegistry;
  private readonly sqsClient = new SQSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
  });

  @Interval(5000)
  async consume(): Promise<void> {
    const queueUrl = Config.SQS_DOMAIN_EVENT_QUEUE_URL;
    if (!queueUrl) return;

    try {
      RequestStorage.reset();
      const response = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
          MaxNumberOfMessages: 1,
        }),
      );
      const message = response.Messages?.[0];
      if (!message?.Body) return;

      const parsed = (
        (JSON.parse(message.Body) as { Message?: string }).Message
          ? JSON.parse(
              (JSON.parse(message.Body) as { Message: string }).Message,
            )
          : JSON.parse(message.Body)
      ) as OutboxMessage;

      await this.dispatch(parsed);

      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async dispatch(message: OutboxMessage): Promise<void> {
    if (!this.registry.has(message.eventType)) {
      this.logger.warn(
        `No handler registered for eventType: ${message.eventType}`,
      );
      return;
    }
    await this.registry.handle(
      message.eventType,
      JSON.parse(message.payload) as object,
    );
  }
}
