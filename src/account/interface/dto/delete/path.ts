import { ApiProperty } from '@nestjs/swagger';

export default class DeleteAccountPathParam {
  @ApiProperty()
  public readonly id: string = '';
}
