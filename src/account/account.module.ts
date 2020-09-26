import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import AccountMapper from '@src/account/infrastructure/mapper/account.mapper';
import AccountQuery from '@src/account/infrastructure/query/account.query';
import RedisAdapter from '@src/account/infrastructure/redis/redis.adapter';
import AccountRepository from '@src/account/infrastructure/repository/account.repository';
import Publisher from '@src/account/infrastructure/message/publisher';

import AccountController from '@src/account/interface/controller/account.controller';

import FindAccountByIdQueryHandler from '@src/account/application/query/handlers/account.handler.query.by.id';
import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account.handler';
import DeleteAccountCommandHandler from '@src/account/application/command/handlers/delete.account.handler';
import AccountCreatedEventHandler from '@src/account/application/event/handlers/account.created.handler';
import AccountUpdatedEventHandler from '@src/account/application/event/handlers/account.updated.handler';
import AccountDeletedEventHandler from '@src/account/application/event/handlers/account.deleted.handler';
import CreateAccountCommandHandler from '@src/account/application/command/handlers/create.account.handler';

import AccountFactory from '@src/account/domain/model/account.factory';
import PasswordFactory from '@src/account/domain/model/password.factory';

const publishers = [Publisher];

const adapters = [RedisAdapter];

const repositories = [AccountRepository];

const queries = [AccountQuery];

const mappers = [AccountMapper];

const controllers = [AccountController];

const queryHandler = [FindAccountByIdQueryHandler];

const commandHandler = [
  CreateAccountCommandHandler,
  UpdateAccountCommandHandler,
  DeleteAccountCommandHandler,
];

const eventHandler = [
  AccountCreatedEventHandler,
  AccountUpdatedEventHandler,
  AccountDeletedEventHandler,
];

const factories = [AccountFactory, PasswordFactory];

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
