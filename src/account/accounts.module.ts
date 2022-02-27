import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStoreImplement } from 'src/account/infrastructure/cache/event-store';
import { IntegrationEventPublisherImplement } from 'src/account/infrastructure/message/integration-event.publisher';
import { AccountQueryImplement } from 'src/account/infrastructure/queries/account.query';
import { AccountRepositoryImplement } from 'src/account/infrastructure/repositories/account.repository';

import { AccountsController } from 'src/account/interface/accounts.controller';

import { CloseAccountHandler } from 'src/account/application/commands/close-account.handler';
import { DepositHandler } from 'src/account/application/commands/deposit.handler';
import { OpenAccountHandler } from 'src/account/application/commands/open-account.handler';
import { RemitHandler } from 'src/account/application/commands/remit.handler';
import { UpdatePasswordHandler } from 'src/account/application/commands/update-password.handler';
import { WithdrawHandler } from 'src/account/application/commands/withdraw.handler';
import { AccountClosedHandler } from 'src/account/application/events/account-closed.handler';
import { AccountOpenedHandler } from 'src/account/application/events/account-opened.handler';
import { DepositedHandler } from 'src/account/application/events/deposited.handler';
import { PasswordUpdatedHandler } from 'src/account/application/events/password-updated.handler';
import { WithdrawnHandler } from 'src/account/application/events/withdrawn.handler';
import { FindAccountByIdHandler } from 'src/account/application/queries/find-account-by-id.handler';
import { FindAccountsHandler } from 'src/account/application/queries/find-accounts.handler';

import { AccountService } from 'src/account/domain/service';
import { AccountFactory } from 'src/account/domain/factory';
import { InjectionToken } from './application/injection.token';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.ACCOUNT_REPOSITORY,
    useClass: AccountRepositoryImplement,
  },
  {
    provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  {
    provide: InjectionToken.EVENT_STORE,
    useClass: EventStoreImplement,
  },
  {
    provide: InjectionToken.ACCOUNT_QUERY,
    useClass: AccountQueryImplement,
  },
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

const domain = [AccountService, AccountFactory];

@Module({
  imports: [CqrsModule],
  controllers: [AccountsController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class AccountsModule {}
