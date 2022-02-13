import { ApiProperty } from '@nestjs/swagger';

import { FindInvoiceByIdResult } from 'src/invoices/application/queries/find-invoice-by-id.result';

export class FindInvoiceByIdResponseDTO extends FindInvoiceByIdResult {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly status: number;

  @ApiProperty()
  readonly openedAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, required: false, example: null })
  readonly closedAt: Date | null;
}
