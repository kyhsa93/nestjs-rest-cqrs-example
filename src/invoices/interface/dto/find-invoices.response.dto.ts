import { ApiProperty } from '@nestjs/swagger';

import {
  FindInvoicesResult,
  ItemInFindInvoicesResult,
} from 'src/invoices/application/queries/find-invoices.result';

class FindInvoicesItem extends ItemInFindInvoicesResult {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly status: number;
}

export class FindInvoicesResponseDTO {
  @ApiProperty({ type: [FindInvoicesItem] })
  readonly invoices: FindInvoicesResult;
}
