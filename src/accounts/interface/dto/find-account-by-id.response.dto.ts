import { ApiProperty } from '@nestjs/swagger';

import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;

  @ApiProperty()
  readonly openedAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, required: false, example: null })
  readonly closedAt: Date | null;
}
