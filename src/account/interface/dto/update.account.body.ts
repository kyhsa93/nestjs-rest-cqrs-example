import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UpdateAccountBody {
  @ApiProperty({ example: 'testpassword' })
  @IsString()
  public readonly newPassword!: string;

  @ApiProperty({ example: 'testpassword' })
  @IsString()
  public readonly oldPassword!: string;
}
