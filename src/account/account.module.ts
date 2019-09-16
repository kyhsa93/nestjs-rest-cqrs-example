import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "./entity/account.entity";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./repository/account.repository";
import { CreateAccountCommandHandler } from "./command/account.handler.command.create";
import { ReadAccountListQueryHandler } from './query/account.handler.query.list';
import { CqrsModule } from "@nestjs/cqrs";
import { ReadAccountQueryHandler } from "./query/account.handler.query";
import { ComparePasswordEventHandler } from "./event/account.handler.event.compare-password";
import { UpdateAccountCommandHandler } from "./command/account.handler.command.update";
import { DeleteAccountCommandHandler } from './command/account.handler.command.delete';

const queryHandler = [
  ReadAccountListQueryHandler,
  ReadAccountQueryHandler,
];

const commandHandler = [
  CreateAccountCommandHandler,
  UpdateAccountCommandHandler,
  DeleteAccountCommandHandler,
];

const eventHandler = [
  ComparePasswordEventHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountController],
  providers: [
    AccountRepository,
    ...commandHandler,
    ...queryHandler,
    ...eventHandler,
  ],
})
export class AccountModule {}
