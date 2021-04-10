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

import OpenAccountBody from '@src/account/interface/dto/open.account.body';
import UpdateAccountPathParam from '@src/account/interface/dto/update.account.param';
import UpdateAccountBody from '@src/account/interface/dto/update.account.body';
import CloseAccountPathParam from '@src/account/interface/dto/close.account.param';
import CloseAccountBody from '@src/account/interface/dto/close.account.body';
import ReadAccountPathParam from '@src/account/interface/dto/get.account.by.id.param';
import GetAccountQuery from '@src/account/interface/dto/get.account.query';

import OpenAccountCommand from '@src/account/application/command/implements/open.account';
import ReadAccountQuery from '@src/account/application/query/implements/find.by.id';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account';
import CloseAccountCommand from '@src/account/application/command/implements/close.account';
import { Account, AccountsAndCount } from '@src/account/application/query/query';
import FindAccountQuery from '@src/account/application/query/implements/find';
import RemittanceBody from '@src/account/interface/dto/remittance.body';
import RemittanceCommand from '@src/account/application/command/implements/remittance';
import { WithdrawBody } from '@src/account/interface/dto/withdraw.body';
import { Withdraw } from '@src/account/application/command/implements/withdraw.account';

@ApiTags('Accounts')
@Controller('/accounts')
export default class AccountController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  public async openAccount(@Body() body: OpenAccountBody): Promise<void> {
    const { name, password } = body;
    await this.commandBus.execute(new OpenAccountCommand(name, password));
  }

  @Post('/remittance')
  public async remittance(@Body() body: RemittanceBody): Promise<void> {
    const {
      senderId, receiverId, password, amount,
    } = body;
    const command = new RemittanceCommand(senderId, receiverId, password, amount);
    await this.commandBus.execute(command);
  }

  @Post('/withdraw')
  public async withdraw(@Param() id: string, @Body() body: WithdrawBody): Promise<void> {
    const command = new Withdraw(id, body.amount, body.password);
    await this.commandBus.execute(command);
  }

  @Put(':id')
  public async updateAccount(
    @Param() param: UpdateAccountPathParam,
      @Body() body: UpdateAccountBody,
  ): Promise<void> {
    const { oldPassword, newPassword } = body;
    await this.commandBus.execute(new UpdateAccountCommand(param.id, oldPassword, newPassword));
  }

  @Delete(':id')
  public async closeAccount(
    @Param() param: CloseAccountPathParam,
      @Body() body: CloseAccountBody,
  ): Promise<void> {
    const { password } = body;
    await this.commandBus.execute(new CloseAccountCommand(param.id, password));
  }

  @Get()
  public async getAccount(
    @Query() { take = 10, page = 1, names = [] }: GetAccountQuery,
  ): Promise<AccountsAndCount> {
    const conditions = { names: this.toArray(names) };
    const query = new FindAccountQuery(take, page, conditions);
    return this.queryBus.execute(query);
  }

  @Get(':id')
  public async getAccountById(
    @Param() param: ReadAccountPathParam,
  ): Promise<Account> {
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(param.id));
    if (!account) throw new NotFoundException();
    return account;
  }

  private toArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value].filter((item) => item !== undefined);
  }
}
