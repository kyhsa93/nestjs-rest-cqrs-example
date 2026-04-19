import { ApiProperty } from '@nestjs/swagger';

import { EntityId } from 'libs/database/database-module';

import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiProperty({ example: new EntityId() })
  override readonly id: string;

  @ApiProperty({ example: 'young' })
  override readonly name: string;

  @ApiProperty({ example: 100 })
  override readonly balance: number;

  @ApiProperty()
  override readonly createdAt: Date;

  @ApiProperty()
  override readonly updatedAt: Date;

  @ApiProperty({ nullable: true, example: null })
  override readonly deletedAt: Date | null;
}
