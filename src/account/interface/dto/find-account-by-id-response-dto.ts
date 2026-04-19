import { ApiProperty } from '@nestjs/swagger';

import { EntityId } from 'libs/database-module';

import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiProperty({ example: new EntityId() })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, example: null })
  readonly deletedAt: Date | null;
}
