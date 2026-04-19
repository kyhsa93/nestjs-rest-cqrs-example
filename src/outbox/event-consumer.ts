import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Interval } from '@nestjs/schedule';

import { discoverMethods } from 'libs/metadata-discovery';
import { RequestStorage } from 'libs/request-storage';

import { Config } from 'src/config';
import {
  HANDLE_EVENT_METADATA,
  HandleEventMetadata,
} from 'src/outbox/handle-event';
import {
  HANDLE_INTEGRATION_EVENT_METADATA,
  HandleIntegrationEventMetadata,
} from 'src/outbox/handle-integration-event';

type OutboxMessage = Readonly<{
  eventId: string;
  eventType: string;
  payload: string;
}>;

@Injectable()
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name);
  @Inject() private readonly discoveryService: DiscoveryService;
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
    const domainHandler = discoverMethods<HandleEventMetadata>(
      this.discoveryService,
      HANDLE_EVENT_METADATA,
      'provider',
    ).find((entry) => entry.meta.eventType === message.eventType);
    if (domainHandler) {
      await domainHandler.method.call(
        domainHandler.instance,
        JSON.parse(message.payload),
      );
      return;
    }

    const integrationHandler = discoverMethods<HandleIntegrationEventMetadata>(
      this.discoveryService,
      HANDLE_INTEGRATION_EVENT_METADATA,
      'controller',
    ).find((entry) => entry.meta.eventName === message.eventType);
    if (integrationHandler) {
      await integrationHandler.method.call(
        integrationHandler.instance,
        JSON.parse(message.payload),
      );
      return;
    }

    this.logger.warn(
      `No handler registered for eventType: ${message.eventType}`,
    );
  }
}
