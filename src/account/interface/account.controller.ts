import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller, Post, Body, Get, Param, Put, Query,
  Delete, UseGuards, Request, HttpException, HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import CreateAccountDTO from './dto/account.dto.create';
import { CreateAccountCommand } from '../application/command/implements/account.command.create';
import Account from '../domain/model/account.model';
import { ReadAccountListQuery } from '../application/query/implements/account.query.list';
import { ReadAccountQuery } from '../application/query/implements/account.query';
import ReadAccountDTO from './dto/account.dto.read';
import { UpdateAccountCommand } from '../application/command/implements/account.command.update';
import ReadAccountListDTO from './dto/account.dto.read.list';
import { DeleteAccountCommand } from '../application/command/implements/account.command.delete';
import AccountUserDTO from './dto/account.dto.user';
import UpdateAccountParamDTO from './dto/account.dto.update.param';
import UpdateAccountBodyDTO from './dto/account.dto.update.body';
import UpdateAccountDTO from './dto/account.dto.update';
import DeleteAccountParamDTO from './dto/account.dto.delete.param';
import DeleteAccountBodyDTO from './dto/account.dto.delete.body';
import DeleteAccountDTO from './dto/account.dto.delete';

@ApiUseTags('Accounts')
@Controller('accounts')
export default class AccountController {
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':accountId')
  getAccount(
    @Request() req: { user: AccountUserDTO },
    @Param() param: ReadAccountDTO,
  ): Promise<Account> {
    if (param.accountId !== req.user.accountId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.queryBus.execute(new ReadAccountQuery(param));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':accountId')
  updateAccount(
    @Request() req: { user: AccountUserDTO },
    @Param() param: UpdateAccountParamDTO,
    @Body() body: UpdateAccountBodyDTO,
  ): Promise<void> {
    if (param.accountId !== req.user.accountId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.commandBus.execute(new UpdateAccountCommand(new UpdateAccountDTO(param, body)));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':accountId')
  deleteAccount(
    @Request() req: { user: AccountUserDTO },
    @Param() param: DeleteAccountParamDTO,
    @Body() body: DeleteAccountBodyDTO,
  ): Promise<void> {
    if (param.accountId !== req.user.accountId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.commandBus.execute(new DeleteAccountCommand(new DeleteAccountDTO(param, body)));
  }
}
