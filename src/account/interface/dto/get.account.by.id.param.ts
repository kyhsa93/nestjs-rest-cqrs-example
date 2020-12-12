import { ApiProperty } from '@nestjs/swagger';

export default class ReadAccountPathParam {
  @ApiProperty()
  public readonly id: string = '';
}
