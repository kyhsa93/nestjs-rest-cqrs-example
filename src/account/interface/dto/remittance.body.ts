import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export default class RemittanceBody {
  @ApiProperty({ example: 'senderId' })
  @IsString()
  public readonly senderId: string = '';

  @ApiProperty({ example: 'receiverId' })
  @IsString()
  public readonly receiverId: string = '';

  @ApiProperty({ example: 'password' })
  @IsString()
  public readonly password: string = '';

  @ApiProperty({ example: 0 })
  @IsInt()
  public readonly amount: number = 0;
}
