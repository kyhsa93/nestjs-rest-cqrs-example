import { DiscoveryService } from '@nestjs-plus/discovery';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { Interval } from '@nestjs/schedule';

import { RequestStorage } from 'libs/RequestStorage';

import { Config } from 'src/Config';
import {
  HANDLE_EVENT_METADATA,
  HandleEventMetadata,
} from 'src/outbox/HandleEvent';
import {
  HANDLE_INTEGRATION_EVENT_METADATA,
  HandleIntegrationEventMetadata,
} from 'src/outbox/HandleIntegrationEvent';

type OutboxMessage = Readonly<{
  eventId: string;
  eventType: string;
  payload: string;
}>;

@Injectable()
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name);
  @Inject() private readonly discover: DiscoveryService;
  @Inject() private readonly modulesContainer: ModulesContainer;
  private readonly sqsClient = new SQSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
    credentials: {
      accessKeyId: Config.AWS_ACCESS_KEY_ID,
      secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
    },
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
    const domainHandler = (
      await this.discover.controllerMethodsWithMetaAtKey<HandleEventMetadata>(
        HANDLE_EVENT_METADATA,
      )
    ).find((entry) => entry.meta.eventType === message.eventType);
    const integrationHandler = (
      await this.discover.controllerMethodsWithMetaAtKey<HandleIntegrationEventMetadata>(
        HANDLE_INTEGRATION_EVENT_METADATA,
      )
    ).find((entry) => entry.meta.eventName === message.eventType);

    const handler = domainHandler ?? integrationHandler;
    if (!handler) {
      this.logger.warn(
        `No handler registered for eventType: ${message.eventType}`,
      );
      return;
    }

    const instance = Array.from(this.modulesContainer.values())
      .filter((module) => 0 < module.controllers.size)
      .flatMap((module) => Array.from(module.controllers.values()))
      .find(
        (wrapper) => wrapper.name === handler.discoveredMethod.parentClass.name,
      )?.instance;
    if (!instance) {
      this.logger.warn(
        `Handler instance not found for ${handler.discoveredMethod.parentClass.name}`,
      );
      return;
    }

    await handler.discoveredMethod.handler.bind(instance)(
      JSON.parse(message.payload),
    );
  }
}
