import {
  DeleteMessageBatchCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

/**
 * Drops messages left on the domain event queue by an earlier spec file. OutboxConsumer
 * takes one message per 5 s tick, so a leftover backlog would delay the next file's emails.
 * Call it while no app is running. SQS short polling can answer "empty" while messages
 * remain, so it only stops after several empty answers in a row.
 */
export async function emptyDomainEventQueue(): Promise<void> {
  const client = new SQSClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
  });
  const queueUrl = process.env.SQS_DOMAIN_EVENT_QUEUE_URL as string;

  let emptyAnswers = 0;
  while (emptyAnswers < 3) {
    const { Messages = [] } = await client.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 1,
      }),
    );
    if (Messages.length === 0) {
      emptyAnswers += 1;
      continue;
    }
    emptyAnswers = 0;
    await client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: Messages.map((message, index) => ({
          Id: String(index),
          ReceiptHandle: message.ReceiptHandle as string,
        })),
      }),
    );
  }
  client.destroy();
}

/**
 * Puts a message on the domain event queue in the shape OutboxPoller publishes
 * ({ eventId, eventType, payload }), so tests can simulate redelivery or unknown events.
 */
export async function sendOutboxMessage(message: {
  eventId: string;
  eventType: string;
  payload: object;
}): Promise<void> {
  const client = new SQSClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
  });
  await client.send(
    new SendMessageCommand({
      QueueUrl: process.env.SQS_DOMAIN_EVENT_QUEUE_URL as string,
      MessageBody: JSON.stringify({
        eventId: message.eventId,
        eventType: message.eventType,
        payload: JSON.stringify(message.payload),
      }),
    }),
  );
  client.destroy();
}
