import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import FindAccountByIdQueryHandler from '@src/account/application/query/handlers/account.handler.query.by.id';
import UpdateAccountCommandHandler from '@src/account/application/command/handlers/account.handler.command.update';
import DeleteAccountCommandHandler from '@src/account/application/command/handlers/account.handler.command.delete';
import { ComparePasswordEventHandler } from '@src/account/application/event/handlers/account.handler.event.compare-password';
import AccountEntity from './infrastructure/entity/account.entity';
import AccountRepository from './infrastructure/repository/account.repository';

import AccountController from './interface/account.controller';

import CreateAccountCommandHandler from './application/command/handlers/account.handler.command.create';

const queryHandler = [FindAccountByIdQueryHandler];

const commandHandler = [
  CreateAccountCommandHandler,
  UpdateAccountCommandHandler,
  DeleteAccountCommandHandler,
];

const eventHandler = [ComparePasswordEventHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountController],
  providers: [AccountRepository, ...commandHandler, ...queryHandler, ...eventHandler],
})
export default class AccountModule {}
