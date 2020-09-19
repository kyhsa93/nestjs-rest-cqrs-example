import { ApiProperty } from '@nestjs/swagger';

export default class DeleteAccountParamDTO {
  @ApiProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
