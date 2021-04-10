import { ApiProperty } from '@nestjs/swagger';

export class WithdrawBody {
  @ApiProperty({ example: 'password' })
  readonly password!: string;

  @ApiProperty({ example: 1000 })
  readonly amount!: number;
}
