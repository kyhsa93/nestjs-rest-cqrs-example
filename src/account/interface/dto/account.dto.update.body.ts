import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAccountBodyDTO {
  @ApiProperty({ example: 'testpassword' })
  public readonly newPassword: string;

  @ApiProperty({ example: 'testpassword' })
  public readonly oldPassword: string;

  constructor(newPassword: string, oldPassword: string) {
    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
  }
}
