import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAccountBody {
  @ApiProperty({ example: 'testpassword' })
  public readonly newPassword: string = '';

  @ApiProperty({ example: 'testpassword' })
  public readonly oldPassword: string = '';
}
