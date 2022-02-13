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

import { DepositBodyDTO } from 'src/invoices/interface/dto/deposit.body.dto';
import { FindInvoicesQueryDTO } from 'src/invoices/interface/dto/find-invoices.query.dto';
import { OpenInvoiceBodyDTO } from 'src/invoices/interface/dto/open-invoice.body.dto';
import { UpdatePasswordBodyDTO } from 'src/invoices/interface/dto/update-password.body.dto';
import { WithdrawBodyDTO } from 'src/invoices/interface/dto/withdraw.body.dto';
import { RemitBodyDTO } from 'src/invoices/interface/dto/remit.body.dto';
import { WithdrawParamDTO } from 'src/invoices/interface/dto/withdraw.param.dto';
import { DepositParamDTO } from 'src/invoices/interface/dto/deposit.param.dto';
import { RemitParamDTO } from 'src/invoices/interface/dto/remit.param.dto';
import { UpdatePasswordParamDTO } from 'src/invoices/interface/dto/update-password.param.dto';
import { DeleteInvoiceParamDTO } from 'src/invoices/interface/dto/delete-invoice.param.dto';
import { DeleteInvoiceQueryDTO } from 'src/invoices/interface/dto/delete-invoice.query.dto';
import { FindInvoiceByIdParamDTO } from 'src/invoices/interface/dto/find-invoice-by-id.param.dto';
import { FindInvoiceByIdResponseDTO } from 'src/invoices/interface/dto/find-invoice-by-id.response.dto';
import { FindInvoicesResponseDTO } from 'src/invoices/interface/dto/find-invoices.response.dto';
import { ResponseDescription } from 'src/invoices/interface/response-description';

import { CloseInvoiceCommand } from 'src/invoices/application/commands/close-invoice.command';
import { DepositCommand } from 'src/invoices/application/commands/deposit.command';
import { OpenInvoiceCommand } from 'src/invoices/application/commands/open-invoice.command';
import { UpdatePasswordCommand } from 'src/invoices/application/commands/update-password.command';
import { WithdrawCommand } from 'src/invoices/application/commands/withdraw.command';
import { FindInvoiceByIdQuery } from 'src/invoices/application/queries/find-invoice-by-id.query';
import { FindInvoicesQuery } from 'src/invoices/application/queries/find-invoices.query';
import { RemitCommand } from 'src/invoices/application/commands/remit.command';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post()
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async openInvoice(@Body() body: OpenInvoiceBodyDTO): Promise<void> {
    const command = new OpenInvoiceCommand(body.name, body.password);
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
  async closeInvoice(
    @Param() param: DeleteInvoiceParamDTO,
    @Query() query: DeleteInvoiceQueryDTO,
  ): Promise<void> {
    const command = new CloseInvoiceCommand(param.id, query.password);
    await this.commandBus.execute(command);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: ResponseDescription.OK,
    type: FindInvoicesResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findInvoices(
    @Query() queryDto: FindInvoicesQueryDTO,
  ): Promise<FindInvoicesResponseDTO> {
    const query = new FindInvoicesQuery(queryDto.offset, queryDto.limit);
    return { invoices: await this.queryBus.execute(query) };
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: ResponseDescription.OK,
    type: FindInvoiceByIdResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findInvoiceById(
    @Param() param: FindInvoiceByIdParamDTO,
  ): Promise<FindInvoiceByIdResponseDTO> {
    const query = new FindInvoiceByIdQuery(param.id);
    return this.queryBus.execute(query);
  }
}
