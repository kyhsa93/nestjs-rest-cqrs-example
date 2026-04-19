import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  AccountClosed,
  AccountDeposited,
  AccountOpened,
  AccountPasswordUpdated,
  AccountWithdrawn,
} from 'libs/MessageModule';

import { SendEmailCommand } from 'src/notification/application/command/SendEmailCommand';
import { HandleIntegrationEvent } from 'src/outbox/HandleIntegrationEvent';

@Controller()
export class AccountIntegrationEventController {
  @Inject() private readonly commandBus: CommandBus;

  @HandleIntegrationEvent(AccountOpened.name)
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

  @HandleIntegrationEvent(AccountPasswordUpdated.name)
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

  @HandleIntegrationEvent(AccountClosed.name)
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

  @HandleIntegrationEvent(AccountDeposited.name)
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

  @HandleIntegrationEvent(AccountWithdrawn.name)
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
