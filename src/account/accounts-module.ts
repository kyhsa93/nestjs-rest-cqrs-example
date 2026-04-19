import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PasswordModule } from 'libs/password-module';

import { AccountQueryImplement } from 'src/account/infrastructure/query/account-query-implement';
import { AccountRepositoryImplement } from 'src/account/infrastructure/repository/account-repository-impl';
import { AccountScheduler } from 'src/account/infrastructure/scheduler/account-scheduler';

import { AccountsController } from 'src/account/interface/accounts-controller';
import { AccountTaskController } from 'src/account/interface/account-task-controller';

import { CloseAccountHandler } from 'src/account/application/command/close-account-handler';
import { DepositHandler } from 'src/account/application/command/deposit-handler';
import { OpenAccountHandler } from 'src/account/application/command/open-account-handler';
import { RemitHandler } from 'src/account/application/command/remit-handler';
import { UpdatePasswordHandler } from 'src/account/application/command/update-password-handler';
import { WithdrawHandler } from 'src/account/application/command/withdraw-handler';
import { AccountQuery } from 'src/account/application/query/account-query';
import { FindAccountByIdHandler } from 'src/account/application/query/find-account-by-id-handler';
import { FindAccountsHandler } from 'src/account/application/query/find-accounts-handler';
import { AccountOpenedHandler } from 'src/account/application/event/account-opened-handler';
import { LockAccountHandler } from 'src/account/application/command/lock-account-handler';
import { PasswordUpdatedHandler } from 'src/account/application/event/password-updated-handler';
import { AccountClosedHandler } from 'src/account/application/event/account-closed-handler';
import { DepositedHandler } from 'src/account/application/event/deposited-handler';
import { WithdrawnHandler } from 'src/account/application/event/withdrawn-handler';

import { AccountDomainService } from 'src/account/domain/account-domain-service';
import { AccountFactory } from 'src/account/domain/account-factory';
import { AccountRepository } from 'src/account/domain/account-repository';

const infrastructure: Provider[] = [
  {
    provide: AccountRepository,
    useClass: AccountRepositoryImplement,
  },
  {
    provide: AccountQuery,
    useClass: AccountQueryImplement,
  },
  AccountScheduler,
];

const application = [
  CloseAccountHandler,
  DepositHandler,
  OpenAccountHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,
  FindAccountByIdHandler,
  FindAccountsHandler,
  AccountOpenedHandler,
  LockAccountHandler,
  PasswordUpdatedHandler,
  AccountClosedHandler,
  DepositedHandler,
  WithdrawnHandler,
];

const domain = [AccountDomainService, AccountFactory];

@Module({
  imports: [CqrsModule, PasswordModule],
  controllers: [AccountsController, AccountTaskController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class AccountsModule {}
