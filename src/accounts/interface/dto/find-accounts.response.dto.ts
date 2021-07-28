import { ApiResponseProperty } from '@nestjs/swagger';

import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from 'src/accounts/application/queries/find-accounts.result';

class FindAccountsItem extends ItemInFindAccountsResult {
  @ApiResponseProperty()
  readonly id: string;

  @ApiResponseProperty()
  readonly name: string;

  @ApiResponseProperty()
  readonly balance: number;
}

export class FindAccountsResponseDTO {
  @ApiResponseProperty({ type: [FindAccountsItem] })
  readonly accounts: FindAccountsResult;
}
