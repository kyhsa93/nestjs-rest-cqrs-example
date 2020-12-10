import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import AccountQuery from '@src/account/infrastructure/query';
import RedisAdapter from '@src/account/infrastructure/cache/adapter';
import AccountRepository from '@src/account/infrastructure/repository';
import IntegrationEventPublisher from '@src/account/infrastructure/message/publisher';

import AccountController from '@src/account/interface/controller/account';

import FindAccountByIdQueryHandler from '@src/account/application/query/handlers/account.query.by.id';
import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account';
import DeleteAccountCommandHandler from '@src/account/application/command/handlers/delete.account';
import CreateAccountCommandHandler from '@src/account/application/command/handlers/create.account';
import AccountCreatedDomainEventHandler from '@src/account/application/event/handlers/account.created';
import AccountUpdatedDomainEventHandler from '@src/account/application/event/handlers/account.updated';
import AccountDeletedDomainEventHandler from '@src/account/application/event/handlers/account.deleted';

import AccountFactory from '@src/account/domain/factory';

const publishers = [IntegrationEventPublisher];

const adapters = [RedisAdapter];

const repositories = [AccountRepository];

const queries = [AccountQuery];

const controllers = [AccountController];

const queryHandler = [FindAccountByIdQueryHandler];

const commandHandler = [
  CreateAccountCommandHandler,
  UpdateAccountCommandHandler,
  DeleteAccountCommandHandler,
];

const eventHandler = [
  AccountCreatedDomainEventHandler,
  AccountUpdatedDomainEventHandler,
  AccountDeletedDomainEventHandler,
];

const factories = [AccountFactory];

@Module({
  imports: [CqrsModule],
  controllers,
  providers: [
    ...publishers,
    ...adapters,
    ...queries,
    ...repositories,
    ...mappers,
    ...commandHandler,
    ...queryHandler,
    ...eventHandler,
    ...factories,
  ],
})
export default class AccountModule {}
