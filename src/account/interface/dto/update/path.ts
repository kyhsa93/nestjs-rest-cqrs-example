import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAccountPathParam {
  @ApiProperty()
  public readonly id: string = '';
}
