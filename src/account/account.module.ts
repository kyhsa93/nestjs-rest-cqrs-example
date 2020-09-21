import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import AccountMapper from '@src/account/infrastructure/mapper/account.mapper';
import AccountQuery from '@src/account/infrastructure/query/account.query';
import RedisAdapter from '@src/account/infrastructure/redis/redis.adapter';

import FindAccountByIdQueryHandler from '@src/account/application/query/handlers/account.handler.query.by.id';
import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account.handler';
import DeleteAccountCommandHandler from '@src/account/application/command/handlers/delete.account.handler';
import AccountCreatedEventHandler from '@src/account/application/event/handlers/account.created.handler';
import AccountUpdatedEventHandler from '@src/account/application/event/handlers/account.updated.handler';
import AccountDeletedEventHandler from '@src/account/application/event/handlers/account.deleted.handler';

import AccountFactory from '@src/account/domain/model/account.factory';
import PasswordFactory from '@src/account/domain/model/password.factory';
import CreateAccountCommandHandler from './application/command/handlers/create.account.handler';
import AccountController from './interface/account.controller';
import AccountEntity from './infrastructure/entity/account.entity';
import AccountRepository from './infrastructure/repository/account.repository';

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
  imports: [CqrsModule, TypeOrmModule.forFeature([AccountEntity])],
  controllers,
  providers: [
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
