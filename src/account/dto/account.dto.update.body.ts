import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateAccountBodyDTO {
  @ApiModelProperty()
  public readonly new_password: string;

  @ApiModelProperty()
  public readonly old_password: string;

  constructor(new_password: string, old_password: string) {
    this.new_password = new_password;
    this.old_password = old_password;
  }
}
