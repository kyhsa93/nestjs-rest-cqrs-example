import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from 'src/invoices/application/injection.token';
import {
  InvoiceQuery,
  ItemInInvoices,
} from 'src/invoices/application/queries/invoice.query';
import { FindInvoicesQuery } from 'src/invoices/application/queries/find-invoices.query';
import {
  FindInvoicesResult,
  ItemInFindInvoicesResult,
} from 'src/invoices/application/queries/find-invoices.result';

@QueryHandler(FindInvoicesQuery)
export class FindInvoicesHandler
  implements IQueryHandler<FindInvoicesQuery, FindInvoicesResult>
{
  constructor(
    @Inject(InjectionToken.INVOICE_QUERY) readonly invoiceQuery: InvoiceQuery,
  ) {}

  async execute(query: FindInvoicesQuery): Promise<FindInvoicesResult> {
    return (await this.invoiceQuery.find(query.offset, query.limit)).map(
      this.filterResultProperties,
    );
  }

  private filterResultProperties(
    data: ItemInInvoices,
  ): ItemInFindInvoicesResult {
    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new ItemInFindInvoicesResult());

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
