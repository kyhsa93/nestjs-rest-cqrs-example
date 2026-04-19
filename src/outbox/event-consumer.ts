import { DiscoveryService } from '@nestjs-plus/discovery';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module as NestModule } from '@nestjs/core/injector/module';
import { Interval } from '@nestjs/schedule';

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
      await this.discover.providerMethodsWithMetaAtKey<HandleEventMetadata>(
        HANDLE_EVENT_METADATA,
      )
    ).find((entry) => entry.meta.eventType === message.eventType);
    if (domainHandler) {
      const instance = this.findInstance(
        domainHandler.discoveredMethod.parentClass.name,
        'provider',
      );
      if (!instance) {
        this.logger.warn(
          `Provider not found for ${domainHandler.discoveredMethod.parentClass.name}`,
        );
        return;
      }
      await domainHandler.discoveredMethod.handler.bind(instance)(
        JSON.parse(message.payload),
      );
      return;
    }

    const integrationHandler = (
      await this.discover.controllerMethodsWithMetaAtKey<HandleIntegrationEventMetadata>(
        HANDLE_INTEGRATION_EVENT_METADATA,
      )
    ).find((entry) => entry.meta.eventName === message.eventType);
    if (integrationHandler) {
      const instance = this.findInstance(
        integrationHandler.discoveredMethod.parentClass.name,
        'controller',
      );
      if (!instance) {
        this.logger.warn(
          `Controller not found for ${integrationHandler.discoveredMethod.parentClass.name}`,
        );
        return;
      }
      await integrationHandler.discoveredMethod.handler.bind(instance)(
        JSON.parse(message.payload),
      );
      return;
    }

    this.logger.warn(
      `No handler registered for eventType: ${message.eventType}`,
    );
  }

  private findInstance(
    className: string,
    kind: 'provider' | 'controller',
  ): unknown {
    const wrappers = Array.from(this.modulesContainer.values()).flatMap(
      (module: NestModule) =>
        Array.from(
          (kind === 'provider'
            ? module.providers
            : module.controllers
          ).values(),
        ) as InstanceWrapper[],
    );
    return wrappers.find((wrapper) => wrapper.name === className)?.instance;
  }
}
