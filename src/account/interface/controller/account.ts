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

import UserDTO from '@src/account/interface/dto/user.dto';
import CreateAccountBody from '@src/account/interface/dto/create/body';
import UpdateAccountPathParam from '@src/account/interface/dto/update/path';
import UpdateAccountBody from '@src/account/interface/dto/update/body';
import DeleteAccountPathParam from '@src/account/interface/dto/delete/path';
import DeleteAccountBody from '@src/account/interface/dto/delete/body';
import ReadAccountPathParam from '@src/account/interface/dto/read/path';

import CreateAccountCommand from '@src/account/application/command/implements/create.account';
import ReadAccountQuery from '@src/account/application/query/implements/account.query.by.id';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account';
import DeleteAccountCommand from '@src/account/application/command/implements/delete.account';

@ApiTags('Accounts')
@Controller('accounts')
export default class AccountController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  public async handleCreateAccountRequest(@Body() body: CreateAccountBody): Promise<void> {
    const { email, password } = body;
    await this.commandBus.execute(new CreateAccountCommand(email, password));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  public async handlerGetAccountByIdRequest(
    @Request() req: { user: UserDTO },
      @Param() param: ReadAccountPathParam,
  ): Promise<Account> {
    if (param.id !== req.user.id) throw new UnauthorizedException();
    return this.queryBus.execute(new ReadAccountQuery(param.id));
  }
}
