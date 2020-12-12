import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import UserDTO from '@src/account/interface/dto/user.dto';
import CreateAccountBody from '@src/account/interface/dto/create/body';
import UpdateAccountPathParam from '@src/account/interface/dto/update/path';
import UpdateAccountBody from '@src/account/interface/dto/update/body';
import DeleteAccountPathParam from '@src/account/interface/dto/delete/path';
import DeleteAccountBody from '@src/account/interface/dto/delete/body';
import ReadAccountPathParam from '@src/account/interface/dto/read/path';

import CreateAccountCommand from '@src/account/application/command/implements/create.account';
import ReadAccountQuery from '@src/account/application/query/implements/find.by.id';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account';
import DeleteAccountCommand from '@src/account/application/command/implements/delete.account';
import { Account } from '@src/account/application/query/query';

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
    @Request() req: { user: UserDTO },
    @Param() param: UpdateAccountPathParam,
    @Body() body: UpdateAccountBody,
  ): Promise<void> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    const { oldPassword, newPassword } = body;
    await this.commandBus.execute(new UpdateAccountCommand(param.id, oldPassword, newPassword));
  }

  @Delete(':id')
  public async handleDeleteAccountRequest(
    @Request() req: { user: UserDTO },
    @Param() param: DeleteAccountPathParam,
    @Body() body: DeleteAccountBody,
  ): Promise<void> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    const { password } = body;
    await this.commandBus.execute(new DeleteAccountCommand(param.id, password));
  }

  @Get(':id')
  public async handlerGetAccountByIdRequest(
    @Request() req: { user: UserDTO },
    @Param() param: ReadAccountPathParam,
  ): Promise<Account> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    const account: Account = await this.queryBus.execute(new ReadAccountQuery(param.id));
    if (!account) throw new NotFoundException();
    return account;
  }
}
