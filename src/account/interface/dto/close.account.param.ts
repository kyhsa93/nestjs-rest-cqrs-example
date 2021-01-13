import { ApiProperty } from '@nestjs/swagger';

export default class CloseAccountPathParam {
  @ApiProperty()
  public readonly id: string = '';
}
