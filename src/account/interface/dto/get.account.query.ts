import { ApiProperty } from "@nestjs/swagger";

export default class GetAccountQuery {
  @ApiProperty({ example: '10' })
  public readonly take!: number;
  
  @ApiProperty({ example: '1' })
  public readonly page!: number;

  @ApiProperty({ isArray: true, name: 'emails', required: false })
  public readonly emails?: string[];
}
