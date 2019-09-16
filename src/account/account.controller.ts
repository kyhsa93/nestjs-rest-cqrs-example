import { ApiUseTags } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, Put, Query, Delete } from "@nestjs/common";
import { CreateAccountDTO } from "./dto/account.dto.create";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateAccountCommand } from "./command/account.command.create";
import { Account } from "./model/account.model";
import { ReadAccountListQuery } from "./query/account.query.list";
import { ReadAccountQuery } from './query/account.query';
import { ReadAccountDTO } from "./dto/account.dto.read";
import { UpdateAccountCommand } from './command/account.command.update';
import { UpdateAccountDTO, UpdateAccountBodyDTO, UpdateAccountParamDTO } from "./dto/account.dto.update";
import { ReadAccountListDTO } from "./dto/account.dto.read.list";
import { DeleteAccountDTO, DeleteAccountParamDTO, DeleteAccountBodyDTO } from "./dto/account.dto.delete";
import { DeleteAccountCommand } from './command/account.command.delete';

@ApiUseTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() body: CreateAccountDTO): Promise<void> {
    return this.commandBus.execute(new CreateAccountCommand(body));
  }

  @Get()
  getAccountByEmailAndPassword(@Query() query: ReadAccountListDTO): Promise<Account> {
    return this.queryBus.execute(new ReadAccountListQuery(query));
  }

  @Get(':accountId')
  getAccount(@Param() param: ReadAccountDTO): Promise<Account> {
    return this.queryBus.execute(new ReadAccountQuery(param));
  }

  @Put(':accountId')
  updateAccount(@Param() param: UpdateAccountParamDTO, @Body() body: UpdateAccountBodyDTO): Promise<void> {
    return this.commandBus.execute(new UpdateAccountCommand(new UpdateAccountDTO(param, body)));
  }

  @Delete(':accountId')
  deleteAccount(@Param() param: DeleteAccountParamDTO, @Body() body: DeleteAccountBodyDTO): Promise<void> {
    return this.commandBus.execute(new DeleteAccountCommand(new DeleteAccountDTO(param, body)));
  }
}
