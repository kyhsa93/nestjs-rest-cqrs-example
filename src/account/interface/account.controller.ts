import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import CreateAccountDTO from './dto/account.dto.create';
import ReadAccountDTO from './dto/account.dto.read';
import AccountUserDTO from './dto/account.dto.user';
import UpdateAccountParamDTO from './dto/account.dto.update.param';
import UpdateAccountBodyDTO from './dto/account.dto.update.body';
import DeleteAccountParamDTO from './dto/account.dto.delete.param';
import DeleteAccountBodyDTO from './dto/account.dto.delete.body';

import CreateAccountCommand from '../application/command/implements/create.account';
import ReadAccountQuery from '../application/query/implements/account.query.by.id';
import UpdateAccountCommand from '../application/command/implements/update.account';
import DeleteAccountCommand from '../application/command/implements/delete.account';

@ApiTags('Accounts')
@Controller('accounts')
export default class AccountController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  public async create(@Body() body: CreateAccountDTO): Promise<void> {
    const { email, password } = body;
    await this.commandBus.execute(new CreateAccountCommand(email, password));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  getAccount(
    @Request() req: { user: AccountUserDTO },
      @Param() param: ReadAccountDTO,
  ): Promise<Account> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    return this.queryBus.execute(new ReadAccountQuery(param.id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':id')
  public async updateAccount(
    @Request() req: { user: AccountUserDTO },
      @Param() param: UpdateAccountParamDTO,
      @Body() body: UpdateAccountBodyDTO,
  ): Promise<void> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    const { oldPassword, newPassword } = body;
    await this.commandBus.execute(new UpdateAccountCommand(param.id, oldPassword, newPassword));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  public async deleteAccount(
    @Request() req: { user: AccountUserDTO },
      @Param() param: DeleteAccountParamDTO,
      @Body() body: DeleteAccountBodyDTO,
  ): Promise<void> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    const { password } = body;
    await this.commandBus.execute(new DeleteAccountCommand(param.id, password));
  }
}
