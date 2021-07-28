import { ApiProperty } from '@nestjs/swagger';

import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from 'src/accounts/application/queries/find-accounts.result';

class FindAccountsItem extends ItemInFindAccountsResult {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;
}

export class FindAccountsResponseDTO {
  @ApiProperty({ type: [FindAccountsItem] })
  readonly accounts: FindAccountsResult;
}
