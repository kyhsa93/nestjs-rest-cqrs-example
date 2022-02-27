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
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { DepositBodyDTO } from 'src/account/interface/dto/deposit.body.dto';
import { FindAccountsQueryDTO } from 'src/account/interface/dto/find-accounts.query.dto';
import { OpenAccountBodyDTO } from 'src/account/interface/dto/open-account.body.dto';
import { UpdatePasswordBodyDTO } from 'src/account/interface/dto/update-password.body.dto';
import { WithdrawBodyDTO } from 'src/account/interface/dto/withdraw.body.dto';
import { RemitBodyDTO } from 'src/account/interface/dto/remit.body.dto';
import { WithdrawParamDTO } from 'src/account/interface/dto/withdraw.param.dto';
import { DepositParamDTO } from 'src/account/interface/dto/deposit.param.dto';
import { RemitParamDTO } from 'src/account/interface/dto/remit.param.dto';
import { UpdatePasswordParamDTO } from 'src/account/interface/dto/update-password.param.dto';
import { DeleteAccountParamDTO } from 'src/account/interface/dto/delete-account.param.dto';
import { DeleteAccountQueryDTO } from 'src/account/interface/dto/delete-account.query.dto';
import { FindAccountByIdParamDTO } from 'src/account/interface/dto/find-account-by-id.param.dto';
import { FindAccountByIdResponseDTO } from 'src/account/interface/dto/find-account-by-id.response.dto';
import { FindAccountsResponseDTO } from 'src/account/interface/dto/find-accounts.response.dto';
import { ResponseDescription } from 'src/account/interface/response-description';

import { CloseAccountCommand } from 'src/account/application/command/close-account.command';
import { DepositCommand } from 'src/account/application/command/deposit.command';
import { OpenAccountCommand } from 'src/account/application/command/open-account.command';
import { UpdatePasswordCommand } from 'src/account/application/command/update-password.command';
import { WithdrawCommand } from 'src/account/application/command/withdraw.command';
import { FindAccountByIdQuery } from 'src/account/application/query/find-account-by-id.query';
import { FindAccountsQuery } from 'src/account/application/query/find-accounts.query';
import { RemitCommand } from 'src/account/application/command/remit.command';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post()
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async openAccount(@Body() body: OpenAccountBodyDTO): Promise<void> {
    const command = new OpenAccountCommand(body.name, body.password);
    await this.commandBus.execute(command);
  }

  @Post('/:id/withdraw')
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async withdraw(
    @Param() param: WithdrawParamDTO,
    @Body() body: WithdrawBodyDTO,
  ): Promise<void> {
    const command = new WithdrawCommand({ ...param, ...body });
    await this.commandBus.execute(command);
  }

  @Post('/:id/deposit')
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async deposit(
    @Param() param: DepositParamDTO,
    @Body() body: DepositBodyDTO,
  ): Promise<void> {
    const command = new DepositCommand({ ...param, ...body });
    await this.commandBus.execute(command);
  }

  @Post('/:id/remit')
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async remit(
    @Param() param: RemitParamDTO,
    @Body() body: RemitBodyDTO,
  ): Promise<void> {
    const command = new RemitCommand({ ...param, ...body });
    await this.commandBus.execute(command);
  }

  @Put('/:id/password')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async updatePassword(
    @Param() param: UpdatePasswordParamDTO,
    @Body() body: UpdatePasswordBodyDTO,
  ): Promise<void> {
    const command = new UpdatePasswordCommand({ ...param, ...body });
    await this.commandBus.execute(command);
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async closeAccount(
    @Param() param: DeleteAccountParamDTO,
    @Query() query: DeleteAccountQueryDTO,
  ): Promise<void> {
    const command = new CloseAccountCommand(param.id, query.password);
    await this.commandBus.execute(command);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: ResponseDescription.OK,
    type: FindAccountsResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccounts(
    @Query() queryDto: FindAccountsQueryDTO,
  ): Promise<FindAccountsResponseDTO> {
    const query = new FindAccountsQuery(queryDto.offset, queryDto.limit);
    return { accounts: await this.queryBus.execute(query) };
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: ResponseDescription.OK,
    type: FindAccountByIdResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccountById(
    @Param() param: FindAccountByIdParamDTO,
  ): Promise<FindAccountByIdResponseDTO> {
    const query = new FindAccountByIdQuery(param.id);
    return this.queryBus.execute(query);
  }
}
