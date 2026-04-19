import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PasswordModule } from 'libs/PasswordModule';

import { AccountQueryImplement } from 'src/account/infrastructure/query/AccountQueryImplement';
import { AccountRepositoryImplement } from 'src/account/infrastructure/repository/account-repository-impl';
import { AccountScheduler } from 'src/account/infrastructure/scheduler/account-scheduler';

import { AccountsController } from 'src/account/interface/AccountsController';
import { AccountTaskController } from 'src/account/interface/AccountTaskController';

import { CloseAccountHandler } from 'src/account/application/command/CloseAccountHandler';
import { DepositHandler } from 'src/account/application/command/DepositHandler';
import { OpenAccountHandler } from 'src/account/application/command/OpenAccountHandler';
import { RemitHandler } from 'src/account/application/command/RemitHandler';
import { UpdatePasswordHandler } from 'src/account/application/command/UpdatePasswordHandler';
import { WithdrawHandler } from 'src/account/application/command/WithdrawHandler';
import { AccountQuery } from 'src/account/application/query/AccountQuery';
import { FindAccountByIdHandler } from 'src/account/application/query/FindAccountByIdHandler';
import { FindAccountsHandler } from 'src/account/application/query/FindAccountsHandler';
import { AccountOpenedHandler } from 'src/account/application/event/account-opened-handler';
import { LockAccountHandler } from 'src/account/application/command/LockAccountHandler';
import { PasswordUpdatedHandler } from 'src/account/application/event/password-updated-handler';
import { AccountClosedHandler } from 'src/account/application/event/account-closed-handler';
import { DepositedHandler } from 'src/account/application/event/deposited-handler';
import { WithdrawnHandler } from 'src/account/application/event/withdrawn-handler';

import { AccountDomainService } from 'src/account/domain/AccountDomainService';
import { AccountFactory } from 'src/account/domain/AccountFactory';
import { AccountRepository } from 'src/account/domain/AccountRepository';

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
