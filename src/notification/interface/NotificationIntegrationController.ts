import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  AccountClosed,
  AccountDeposited,
  AccountOpened,
  AccountPasswordUpdated,
  AccountWithdrawn,
  MessageHandler,
  Topic,
} from 'libs/MessageModule';

import { SendEmailCommand } from 'src/notification/application/command/SendEmailCommand';

@Controller()
export class NotificationIntegrationController {
  @Inject() private readonly commandBus: CommandBus;

  @MessageHandler(Topic.ACCOUNT_OPENED)
  async sendNewAccountEmail(message: AccountOpened): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'New account created',
        content: 'New account it opened with this email',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_PASSWORD_UPDATED)
  async sendPasswordUpdatedEmail(
    message: AccountPasswordUpdated,
  ): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Account password updated',
        content: 'Account password is updated',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_CLOSED)
  async sendAccountClosedEmail(message: AccountClosed): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Account closed',
        content: 'Account is closed',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_DEPOSITED)
  async sendDepositEmail(message: AccountDeposited): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Deposited',
        content: 'Deposited into the account',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_WITHDRAWN)
  async sendWithdrawnEmail(message: AccountWithdrawn): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Withdrawn',
        content: 'It has been withdrawn from your account',
      }),
    );
  }
}
