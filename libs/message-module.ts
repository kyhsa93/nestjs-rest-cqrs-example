import {
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  SetMetadata,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { IEvent } from '@nestjs/cqrs';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  CreateTopicCommand,
  SNSClient,
  PublishCommand,
} from '@aws-sdk/client-sns';
import { Interval } from '@nestjs/schedule';

import { discoverMethods } from 'libs/metadata-discovery';
import { RequestStorage } from 'libs/request-storage';

import { Config } from 'src/config';

type Message = Readonly<{ name: string; body: IEvent; requestId: string }>;
type MessageHandlerMetadata = Readonly<{ name: string }>;

const SQS_CONSUMER_METHOD = Symbol.for('SQS_CONSUMER_METHOD');
export const MessageHandler = (name: string) =>
  SetMetadata<symbol, MessageHandlerMetadata>(SQS_CONSUMER_METHOD, { name });

class SQSConsumerService implements OnModuleDestroy {
  private readonly logger = new Logger(SQSConsumerService.name);
  @Inject() private readonly discoveryService: DiscoveryService;
  private readonly sqsClient = new SQSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
  });

  @Interval(5000)
  async handleMessage(): Promise<void> {
    RequestStorage.reset();
    const response = (
      await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: Config.AWS_SQS_QUEUE_URL,
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
          MaxNumberOfMessages: 1,
        }),
      )
    ).Messages;
    if (!response || !response[0] || !response[0].Body) return;

    const message = (
      (JSON.parse(response[0].Body) as { Message?: string }).Message
        ? JSON.parse(
            (JSON.parse(response[0].Body) as { Message: string }).Message,
          )
        : JSON.parse(response[0].Body)
    ) as Message;
    RequestStorage.setRequestId(message.requestId);

    const handler = discoverMethods<MessageHandlerMetadata>(
      this.discoveryService,
      SQS_CONSUMER_METHOD,
      'controller',
    ).find((entry) => entry.meta.name === message.name);
    if (!handler)
      throw new Error(
        `Message handler is not found. Message: ${JSON.stringify(message)}`,
      );

    try {
      await handler.method.call(handler.instance, message.body);
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: Config.AWS_SQS_QUEUE_URL,
          ReceiptHandle: response[0].ReceiptHandle,
        }),
      );
    } catch (error) {
      return this.logger.error(
        `Message handling error. Message: ${JSON.stringify(
          message,
        )}. Error: ${error}`,
      );
    }
    this.logger.log(
      `Message handling completed. Message: ${JSON.stringify(message)}`,
    );
  }

  onModuleDestroy(): void {
    this.sqsClient.destroy();
  }
}

export enum Topic {
  ACCOUNT_OPENED = 'AccountOpened',
  ACCOUNT_PASSWORD_UPDATED = 'AccountPasswordUpdated',
  ACCOUNT_CLOSED = 'AccountClosed',
  ACCOUNT_DEPOSITED = 'AccountDeposited',
  ACCOUNT_WITHDRAWN = 'AccountWithdrawn',
}

export class AccountOpened {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}

export class AccountPasswordUpdated {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}

export class AccountClosed {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}

export class AccountDeposited {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}

export class AccountWithdrawn {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}

class SNSMessagePublisher {
  private readonly snsClient = new SNSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
  });
  private readonly logger = new Logger(SNSMessagePublisher.name);

  async publish(Name: Topic, Message: Message): Promise<void> {
    const message = {
      TopicArn: (await this.snsClient.send(new CreateTopicCommand({ Name })))
        .TopicArn,
      Message: JSON.stringify(Message),
    };
    await this.snsClient.send(new PublishCommand(message));
    this.logger.log(`Message published. Message: ${JSON.stringify(message)}`);
  }
}

export interface IntegrationEventPublisher {
  publish: (name: Topic, body: IEvent) => Promise<void>;
}

class IntegrationEventPublisherImplement implements IntegrationEventPublisher {
  @Inject() private readonly snsMessagePublisher: SNSMessagePublisher;

  async publish(name: Topic, body: IEvent): Promise<void> {
    await this.snsMessagePublisher.publish(name, {
      name,
      body,
      requestId: RequestStorage.getStorage().requestId,
    });
  }
}

export const INTEGRATION_EVENT_PUBLISHER = 'IntegrationEventPublisher';

class SQSMessagePublisher {
  private readonly sqsClient = new SQSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
  });
  private readonly logger = new Logger(SQSMessagePublisher.name);

  async publish(message: Message): Promise<void> {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: Config.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify(message),
        DelaySeconds: Math.round(Math.random() * 10),
      }),
    );
    this.logger.log(`Message published. Message: ${JSON.stringify(message)}`);
  }
}

export interface TaskPublisher {
  publish: (name: string, task: IEvent) => Promise<void>;
}

class TaskPublisherImplement implements TaskPublisher {
  @Inject() private readonly sqsMessagePublisher: SQSMessagePublisher;

  async publish(name: string, body: IEvent): Promise<void> {
    await this.sqsMessagePublisher.publish({
      name,
      body,
      requestId: RequestStorage.getStorage().requestId,
    });
  }
}

export const TASK_PUBLISHER = 'TaskPublisher';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    SQSConsumerService,
    SNSMessagePublisher,
    SQSMessagePublisher,
    {
      provide: INTEGRATION_EVENT_PUBLISHER,
      useClass: IntegrationEventPublisherImplement,
    },
    {
      provide: TASK_PUBLISHER,
      useClass: TaskPublisherImplement,
    },
  ],
  exports: [INTEGRATION_EVENT_PUBLISHER, TASK_PUBLISHER],
})
export class MessageModule {}
