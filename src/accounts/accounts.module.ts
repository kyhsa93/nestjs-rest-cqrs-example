import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CacheAdapter } from 'src/accounts/infrastructure/cache/cache.adapter';
import { IntegrationEventPublisher } from 'src/accounts/infrastructure/message/integration-event.publisher';
import { AccountQueryImplement } from 'src/accounts/infrastructure/queries/account.query';
import { AccountRepositoryImplement } from 'src/accounts/infrastructure/repositories/account.repository';

import { AccountsController } from 'src/accounts/interface/accounts.controller';

import { CloseAccountHandler } from 'src/accounts/application/commands/close-account.handler';
import { DepositHandler } from 'src/accounts/application/commands/deposit.handler';
import { OpenAccountHandler } from 'src/accounts/application/commands/open-account.handler';
import { RemitHandler } from 'src/accounts/application/commands/remit.handler';
import { UpdatePasswordHandler } from 'src/accounts/application/commands/update-password.handler';
import { WithdrawHandler } from 'src/accounts/application/commands/withdraw.handler';
import { AccountClosedHandler } from 'src/accounts/application/events/account-closed.handler';
import { AccountOpenedHandler } from 'src/accounts/application/events/account-opened.handler';
import { DepositedHandler } from 'src/accounts/application/events/deposited.handler';
import { PasswordUpdatedHandler } from 'src/accounts/application/events/password-updated.handler';
import { WithdrawnHandler } from 'src/accounts/application/events/withdrawn.handler';
import { FindAccountByIdHandler } from 'src/accounts/application/queries/find-account-by-id.handler';
import { FindAccountsHandler } from 'src/accounts/application/queries/find-accounts.handler';

import { AccountService } from 'src/accounts/domain/service';

const infrastructure = [
  AccountRepositoryImplement,
  CacheAdapter,
  IntegrationEventPublisher,
  AccountQueryImplement,
];

const application = [
  CloseAccountHandler,
  DepositHandler,
  OpenAccountHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,
  AccountClosedHandler,
  AccountOpenedHandler,
  DepositedHandler,
  PasswordUpdatedHandler,
  WithdrawnHandler,
  FindAccountByIdHandler,
  FindAccountsHandler,
];

const domain = [AccountService];

@Module({
  imports: [CqrsModule],
  controllers: [AccountsController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class AccountsModule {}
