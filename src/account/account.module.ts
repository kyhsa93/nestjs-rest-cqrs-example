import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import AccountQuery from '@src/account/infrastructure/query';
import RedisAdapter from '@src/account/infrastructure/cache/adapter';
import AccountRepository from '@src/account/infrastructure/repository';
import IntegrationEventPublisher from '@src/account/infrastructure/message/publisher';

import AccountController from '@src/account/interface/account.controller';

import FindAccountByIdHandler from '@src/account/application/query/handlers/find.by.id';
import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account';
import CloseAccountCommandHandler from '@src/account/application/command/handlers/close.account';
import OpenAccountCommandHandler from '@src/account/application/command/handlers/open.account';
import RemittanceCommandHandler from '@src/account/application/command/handlers/remittance';
import AccountOpenedDomainEventHandler from '@src/account/application/event/handlers/account.opened';
import AccountUpdatedDomainEventHandler from '@src/account/application/event/handlers/account.updated';
import AccountClosedDomainEventHandler from '@src/account/application/event/handlers/account.closed';
import FindAccountsQueryHandler from '@src/account/application/query/handlers/find';

import AccountFactory from '@src/account/domain/factory';
import AccountDomainService from '@src/account/domain/service';

const publishers = [IntegrationEventPublisher];

const adapters = [RedisAdapter];

const repositories = [AccountRepository];

const queries = [AccountQuery];

const controllers = [AccountController];

const queryHandler = [FindAccountByIdHandler, FindAccountsQueryHandler];

const commandHandler = [
  OpenAccountCommandHandler,
  UpdateAccountCommandHandler,
  CloseAccountCommandHandler,
  RemittanceCommandHandler,
];

const eventHandler = [
  AccountOpenedDomainEventHandler,
  AccountUpdatedDomainEventHandler,
  AccountClosedDomainEventHandler,
];

const factories = [AccountFactory];

const domainService = [AccountDomainService];

@Module({
  imports: [CqrsModule],
  controllers,
  providers: [
    ...publishers,
    ...adapters,
    ...queries,
    ...repositories,
    ...commandHandler,
    ...queryHandler,
    ...eventHandler,
    ...factories,
    ...domainService,
  ],
})
export default class AccountModule {}
