import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import CreateAccountBody from '@src/account/interface/dto/create.account.body';
import UpdateAccountPathParam from '@src/account/interface/dto/update.account.param';
import UpdateAccountBody from '@src/account/interface/dto/update.account.body';
import DeleteAccountPathParam from '@src/account/interface/dto/delete.account.param';
import DeleteAccountBody from '@src/account/interface/dto/delete.account.body';
import ReadAccountPathParam from '@src/account/interface/dto/get.account.by.id.param';
import GetAccountQuery from '@src/account/interface/dto/get.account.query';

import CreateAccountCommand from '@src/account/application/command/implements/create.account';
import ReadAccountQuery from '@src/account/application/query/implements/find.by.id';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account';
import DeleteAccountCommand from '@src/account/application/command/implements/delete.account';
import { Account, AccountsAndCount } from '@src/account/application/query/query';
import FindAccountQuery from '@src/account/application/query/implements/find';

@ApiTags('Accounts')
@Controller('accounts')
export default class AccountController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  public async handleCreateAccountRequest(@Body() body: CreateAccountBody): Promise<void> {
    const { email, password } = body;
    await this.commandBus.execute(new CreateAccountCommand(email, password));
  }

  @Put(':id')
  public async handleUpdateAccountRequest(
    @Param() param: UpdateAccountPathParam,
    @Body() body: UpdateAccountBody,
  ): Promise<void> {
    const { oldPassword, newPassword } = body;
    await this.commandBus.execute(new UpdateAccountCommand(param.id, oldPassword, newPassword));
  }

  @Delete(':id')
  public async handleDeleteAccountRequest(
    @Param() param: DeleteAccountPathParam,
    @Body() body: DeleteAccountBody,
  ): Promise<void> {
    const { password } = body;
    await this.commandBus.execute(new DeleteAccountCommand(param.id, password));
  }

  @Get()
  public async handleGetAccountRequest(
    @Query() { take = 10, page = 1, emails = [] }: GetAccountQuery,
  ): Promise<AccountsAndCount> {
    const conditions = { emails: this.toArray(emails) };
    const query = new FindAccountQuery(take, page, conditions);
    return this.queryBus.execute(query);
  }

  @Get(':id')
  public async handlerGetAccountByIdRequest(
    @Param() param: ReadAccountPathParam,
  ): Promise<Account> {
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(param.id));
    if (!account) throw new NotFoundException();
    return account;
  }

  private toArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value].filter(item => item !== undefined);
  }
}
