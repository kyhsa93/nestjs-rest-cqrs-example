import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseInterceptors,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
  Headers,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  ErrorExceptionMapping,
  generateErrorResponse,
} from 'libs/error/generate-error-response';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { Auth, AuthorizedHeader } from 'libs/auth/auth';

import { DepositRequestDto } from 'src/account/interface/dto/deposit-request-dto';
import { FindAccountsRequestQueryString } from 'src/account/interface/dto/find-accounts-request-query-string';
import { OpenAccountRequestDTO } from 'src/account/interface/dto/open-account-request-dto';
import { UpdatePasswordRequestDTO } from 'src/account/interface/dto/update-password-request-dto';
import { WithdrawRequestDTO } from 'src/account/interface/dto/withdraw-request-dto';
import { RemitRequestDTO } from 'src/account/interface/dto/remit-request-dto';
import { WithdrawRequestParam } from 'src/account/interface/dto/withdraw-request-param';
import { DepositRequestParam } from 'src/account/interface/dto/deposit-request-param';
import { RemitRequestParam } from 'src/account/interface/dto/remit-request-param';
import { UpdatePasswordRequestParam } from 'src/account/interface/dto/update-password-request-param';
import { DeleteAccountRequestParam } from 'src/account/interface/dto/delete-account-request-param';
import { FindAccountByIdRequestParam } from 'src/account/interface/dto/find-account-by-id-request-param';
import { FindAccountByIdResponseDTO } from 'src/account/interface/dto/find-account-by-id-response-dto';
import { FindAccountsResponseDto } from 'src/account/interface/dto/find-accounts-response-dto';
import { ResponseDescription } from 'src/account/interface/response-description';

import { CloseAccountCommand } from 'src/account/application/command/close-account-command';
import { DepositCommand } from 'src/account/application/command/deposit-command';
import { OpenAccountCommand } from 'src/account/application/command/open-account-command';
import { UpdatePasswordCommand } from 'src/account/application/command/update-password-command';
import { WithdrawCommand } from 'src/account/application/command/withdraw-command';
import { FindAccountByIdQuery } from 'src/account/application/query/find-account-by-id-query';
import { FindAccountsQuery } from 'src/account/application/query/find-accounts-query';
import { RemitCommand } from 'src/account/application/command/remit-command';

import { ErrorCode } from 'src/account/domain/error-code';
import { ErrorMessage } from 'src/account/domain/error-message';

const errorMappings: ErrorExceptionMapping[] = [
  [
    ErrorMessage.ACCOUNT_IS_NOT_FOUND,
    NotFoundException,
    ErrorCode.ACCOUNT_IS_NOT_FOUND,
  ],
  [
    ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
    UnprocessableEntityException,
    ErrorCode.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
  ],
  [
    ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
    InternalServerErrorException,
    ErrorCode.CAN_NOT_WITHDRAW_UNDER_1,
  ],
  [
    ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
    UnprocessableEntityException,
    ErrorCode.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
  ],
  [
    ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
    InternalServerErrorException,
    ErrorCode.CAN_NOT_DEPOSIT_UNDER_1,
  ],
  [
    ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED,
    UnprocessableEntityException,
    ErrorCode.ACCOUNT_BALANCE_IS_REMAINED,
  ],
  [
    ErrorMessage.ACCOUNT_IS_ALREADY_LOCKED,
    UnprocessableEntityException,
    ErrorCode.ACCOUNT_IS_ALREADY_LOCKED,
  ],
  [
    ErrorMessage.INTERNAL_SERVER_ERROR,
    InternalServerErrorException,
    ErrorCode.INTERNAL_SERVER_ERROR,
  ],
];

const mapError = (error: Error): never => {
  throw generateErrorResponse(error.message, errorMappings);
};

@ApiTags('Accounts')
@Controller()
export class AccountsController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

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
    await this.commandBus.execute(command).catch(mapError);
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
    await this.commandBus
      .execute(new WithdrawCommand(param.accountId, body.amount))
      .catch(mapError);
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
    await this.commandBus
      .execute(new DepositCommand(param.accountId, body.amount))
      .catch(mapError);
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
    await this.commandBus
      .execute(new RemitCommand(param.accountId, body.receiverId, body.amount))
      .catch(mapError);
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
    await this.commandBus
      .execute(new UpdatePasswordCommand(param.accountId, body.password))
      .catch(mapError);
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
    await this.commandBus
      .execute(new CloseAccountCommand(param.accountId))
      .catch(mapError);
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
    return {
      accounts: await this.queryBus.execute(query).catch(mapError),
    };
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
    return this.queryBus
      .execute(new FindAccountByIdQuery(param.accountId))
      .catch(mapError);
  }
}
