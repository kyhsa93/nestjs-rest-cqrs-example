import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from 'src/invoices/application/injection.token';
import { InvoiceQuery } from 'src/invoices/application/queries/invoice.query';
import { FindInvoiceByIdQuery } from 'src/invoices/application/queries/find-invoice-by-id.query';
import { FindInvoiceByIdResult } from 'src/invoices/application/queries/find-invoice-by-id.result';

import { ErrorMessage } from 'src/invoices/domain/error/error';

@QueryHandler(FindInvoiceByIdQuery)
export class FindInvoiceByIdHandler
  implements IQueryHandler<FindInvoiceByIdQuery, FindInvoiceByIdResult>
{
  constructor(
    @Inject(InjectionToken.INVOICE_QUERY) readonly invoiceQuery: InvoiceQuery,
  ) {}

  async execute(query: FindInvoiceByIdQuery): Promise<FindInvoiceByIdResult> {
    const data = await this.invoiceQuery.findById(query.id);
    if (!data) throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindInvoiceByIdResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return data;
  }
}
