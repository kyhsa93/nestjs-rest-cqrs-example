import { ApiProperty } from "@nestjs/swagger";

export default class RemittanceBody {
  @ApiProperty({ example: 'senderId' })
  public readonly senderId: string = '';

  @ApiProperty({ example: 'receiverId' })
  public readonly receiverId: string = '';

  @ApiProperty({ example: 'password' })
  public readonly password: string = '';

  @ApiProperty({ example: 0 })
  public readonly amount: number = 0;
}
