import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';

import { writeConnection } from 'libs/DatabaseModule';

import { Config } from 'src/Config';
import { OutboxEntity } from 'src/outbox/OutboxEntity';

@Injectable()
export class OutboxRelay {
  private readonly logger = new Logger(OutboxRelay.name);
  private readonly sqsClient = new SQSClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
    credentials: {
      accessKeyId: Config.AWS_ACCESS_KEY_ID,
      secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
    },
  });

  @Cron(CronExpression.EVERY_5_SECONDS)
  async relay(): Promise<void> {
    try {
      const queueUrl =
        Config.SQS_DOMAIN_EVENT_QUEUE_URL ?? Config.AWS_SQS_QUEUE_URL;
      if (!queueUrl) return;

      const repository = writeConnection.manager.getRepository(OutboxEntity);
      const pending = await repository.find({
        where: { processed: false },
        order: { createdAt: 'ASC' },
        take: 100,
      });

      for (const event of pending) {
        await this.sqsClient.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
              eventId: event.eventId,
              eventType: event.eventType,
              payload: event.payload,
            }),
          }),
        );
        await repository.update(
          { eventId: event.eventId },
          { processed: true },
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanup(): Promise<void> {
    try {
      const repository = writeConnection.manager.getRepository(OutboxEntity);
      const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await repository.delete({
        processed: true,
        createdAt: LessThan(threshold),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
