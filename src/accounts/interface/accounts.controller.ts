import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { DepositDTO } from 'src/accounts/interface/dto/deposit.dto';
import { FindAccountsDTO } from 'src/accounts/interface/dto/find-accounts.dto';
import { OpenAccountDTO } from 'src/accounts/interface/dto/open-account.dto';
import { UpdatePasswordDTO } from 'src/accounts/interface/dto/update-password.dto';
import { WithdrawDTO } from 'src/accounts/interface/dto/withdraw.dto';
import { RemitDTO } from 'src/accounts/interface/dto/remit.dto';

import { CloseAccountCommand } from 'src/accounts/application/commands/close-account.command';
import { DepositCommand } from 'src/accounts/application/commands/deposit.command';
import { OpenAccountCommand } from 'src/accounts/application/commands/open-account.command';
import { UpdatePasswordCommand } from 'src/accounts/application/commands/update-password.command';
import { WithdrawCommand } from 'src/accounts/application/commands/withdraw.command';
import { FindAccountByIdQuery } from 'src/accounts/application/queries/find-account-by-id.query';
import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';
import { FindAccountsQuery } from 'src/accounts/application/queries/find-accounts.query';
import { FindAccountsResult } from 'src/accounts/application/queries/find-accounts.result';
import { RemitCommand } from 'src/accounts/application/commands/remit.command';

@Controller('accounts')
export class AccountsController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post()
  async openAccount(@Body() dto: OpenAccountDTO): Promise<void> {
    const command = new OpenAccountCommand(dto.name, dto.password);
    await this.commandBus.execute(command);
  }

  @Post('/:id/withdraw')
  async withdraw(
    @Param('id') id: string,
    @Body() dto: WithdrawDTO,
  ): Promise<void> {
    const command = new WithdrawCommand(id, dto.password, dto.amount);
    await this.commandBus.execute(command);
  }

  @Post('/:id/deposit')
  async deposit(
    @Param('id') id: string,
    @Body() dto: DepositDTO,
  ): Promise<void> {
    const command = new DepositCommand(id, dto.password, dto.amount);
    await this.commandBus.execute(command);
  }

  @Post('/:id/remit')
  async remit(@Param('id') id: string, @Body() dto: RemitDTO): Promise<void> {
    const command = new RemitCommand(
      id,
      dto.receiverId,
      dto.amount,
      dto.password,
    );
    await this.commandBus.execute(command);
  }

  @Put('/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDTO,
  ): Promise<void> {
    const command = new UpdatePasswordCommand(id, dto.current, dto.data);
    await this.commandBus.execute(command);
  }

  @Delete('/:id')
  async closeAccount(
    @Param('id') id: string,
    @Query('password') password: string,
  ): Promise<void> {
    const command = new CloseAccountCommand(id, password);
    await this.commandBus.execute(command);
  }

  @Get()
  async findAccounts(
    @Query() dto: FindAccountsDTO,
  ): Promise<{ accounts: FindAccountsResult }> {
    const query = new FindAccountsQuery(dto.offset, dto.limit);
    return { accounts: await this.queryBus.execute(query) };
  }

  @Get('/:id')
  async findAccountById(
    @Param('id') id: string,
  ): Promise<FindAccountByIdResult> {
    const query = new FindAccountByIdQuery(id);
    return this.queryBus.execute(query);
  }
}
