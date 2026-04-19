import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PasswordModule } from 'libs/PasswordModule';

import { AccountQueryImplement } from 'src/account/infrastructure/query/AccountQueryImplement';
import { AccountRepositoryImplement } from 'src/account/infrastructure/repository/AccountRepositoryImplement';
import { AccountScheduler } from 'src/account/infrastructure/scheduler/account-scheduler';

import { AccountsController } from 'src/account/interface/AccountsController';
import { AccountTaskController } from 'src/account/interface/AccountTaskController';

import { CloseAccountHandler } from 'src/account/application/command/CloseAccountHandler';
import { DepositHandler } from 'src/account/application/command/DepositHandler';
import { OpenAccountHandler } from 'src/account/application/command/OpenAccountHandler';
import { RemitHandler } from 'src/account/application/command/RemitHandler';
import { UpdatePasswordHandler } from 'src/account/application/command/UpdatePasswordHandler';
import { WithdrawHandler } from 'src/account/application/command/WithdrawHandler';
import { FindAccountByIdHandler } from 'src/account/application/query/FindAccountByIdHandler';
import { FindAccountsHandler } from 'src/account/application/query/FindAccountsHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';
import { AccountOpenedHandler } from 'src/account/application/event/AccountOpenedHandler';
import { LockAccountHandler } from 'src/account/application/command/LockAccountHandler';
import { PasswordUpdatedHandler } from 'src/account/application/event/PasswordUpdatedHandler';
import { AccountClosedHandler } from 'src/account/application/event/AccountClosedHandler';
import { DepositedHandler } from 'src/account/application/event/DepositedHandler';
import { WithdrawnHandler } from 'src/account/application/event/WithdrawnHandler';

import { AccountDomainService } from 'src/account/domain/AccountDomainService';
import { AccountFactory } from 'src/account/domain/AccountFactory';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.ACCOUNT_REPOSITORY,
    useClass: AccountRepositoryImplement,
  },
  {
    provide: InjectionToken.ACCOUNT_QUERY,
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
