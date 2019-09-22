import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "./infrastructure/entity/account.entity";
import { AccountController } from "./interface/account.controller";
import { AccountRepository } from "./infrastructure/repository/account.repository";
import { CreateAccountCommandHandler } from "./application/command/account.handler.command.create";
import { ReadAccountListQueryHandler } from './application/query/account.handler.query.list';
import { CqrsModule } from "@nestjs/cqrs";
import { ReadAccountQueryHandler } from "./application/query/account.handler.query";
import { ComparePasswordEventHandler } from "./application/event/account.handler.event.compare-password";
import { UpdateAccountCommandHandler } from "./application/command/account.handler.command.update";
import { DeleteAccountCommandHandler } from './application/command/account.handler.command.delete';

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
