import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  Headers,
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

import { Auth, AuthorizedHeader } from 'libs/Auth';

import { DepositRequestDto } from 'src/account/interface/dto/DepositRequestDto';
import { FindAccountsRequestQueryString } from 'src/account/interface/dto/FindAccountsRequestQueryString';
import { OpenAccountRequestDTO } from 'src/account/interface/dto/OpenAccountRequestDTO';
import { UpdatePasswordRequestDTO } from 'src/account/interface/dto/UpdatePasswordRequestDTO';
import { WithdrawRequestDTO } from 'src/account/interface/dto/WithdrawRequestDTO';
import { RemitRequestDTO } from 'src/account/interface/dto/RemitRequestDTO';
import { WithdrawRequestParam } from 'src/account/interface/dto/WithdrawRequestParam';
import { DepositRequestParam } from 'src/account/interface/dto/DepositRequestParam';
import { RemitRequestParam } from 'src/account/interface/dto/RemitRequestParam';
import { UpdatePasswordRequestParam } from 'src/account/interface/dto/UpdatePasswordRequestParam';
import { DeleteAccountRequestParam } from 'src/account/interface/dto/DeleteAccountRequestParam';
import { FindAccountByIdRequestParam } from 'src/account/interface/dto/FindAccountByIdRequestParam';
import { FindAccountByIdResponseDTO } from 'src/account/interface/dto/FindAccountByIdResponseDTO';
import { FindAccountsResponseDto } from 'src/account/interface/dto/FindAccountsResponseDto';
import { ResponseDescription } from 'src/account/interface/ResponseDescription';

import { CloseAccountCommand } from 'src/account/application/command/CloseAccountCommand';
import { DepositCommand } from 'src/account/application/command/DepositCommand';
import { OpenAccountCommand } from 'src/account/application/command/OpenAccountCommand';
import { UpdatePasswordCommand } from 'src/account/application/command/UpdatePasswordCommand';
import { WithdrawCommand } from 'src/account/application/command/WithdrawCommand';
import { FindAccountByIdQuery } from 'src/account/application/query/FindAccountByIdQuery';
import { FindAccountsQuery } from 'src/account/application/query/FindAccountsQuery';
import { RemitCommand } from 'src/account/application/command/RemitCommand';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';

@ApiTags('Accounts')
@Controller()
export class AccountsController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post('accounts')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async openAccount(@Body() body: OpenAccountRequestDTO): Promise<void> {
    const command = new OpenAccountCommand(
      body.name,
      body.email,
      body.password,
    );
    await this.commandBus.execute(command);
  }

  @Auth()
  @Post('accounts/:accountId/withdraw')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
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
    @Headers() header: AuthorizedHeader,
    @Param() param: WithdrawRequestParam,
    @Body() body: WithdrawRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new WithdrawCommand(param.accountId, body.amount),
    );
  }

  @Auth()
  @Post('accounts/:accountId/deposit')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async deposit(
    @Headers() header: AuthorizedHeader,
    @Param() param: DepositRequestParam,
    @Body() body: DepositRequestDto,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new DepositCommand(param.accountId, body.amount),
    );
  }

  @Auth()
  @Post('accounts/:accountId/remit')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
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
    @Headers() header: AuthorizedHeader,
    @Param() param: RemitRequestParam,
    @Body() body: RemitRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new RemitCommand(param.accountId, body.receiverId, body.amount),
    );
  }

  @Auth()
  @Patch('accounts/:accountId/password')
  @ApiResponse({ status: HttpStatus.OK, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async updatePassword(
    @Headers() header: AuthorizedHeader,
    @Param() param: UpdatePasswordRequestParam,
    @Body() body: UpdatePasswordRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new UpdatePasswordCommand(param.accountId, body.password),
    );
  }

  @Auth()
  @Delete('accounts/:accountId')
  @ApiResponse({ status: HttpStatus.OK, description: ResponseDescription.OK })
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
    @Headers() header: AuthorizedHeader,
    @Param() param: DeleteAccountRequestParam,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(new CloseAccountCommand(param.accountId));
  }

  @Get('accounts')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindAccountsResponseDto,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccounts(
    @Query() querystring: FindAccountsRequestQueryString,
  ): Promise<FindAccountsResponseDto> {
    const query = new FindAccountsQuery(querystring);
    return { accounts: await this.queryBus.execute(query) };
  }

  @Auth()
  @Get('accounts/:accountId')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindAccountByIdResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccountById(
    @Headers() header: AuthorizedHeader,
    @Param() param: FindAccountByIdRequestParam,
  ): Promise<FindAccountByIdResponseDTO> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    return this.queryBus.execute(new FindAccountByIdQuery(param.accountId));
  }
}
