import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export default class GetAccountQuery {
  @ApiProperty({ example: 10 })
  @IsInt()
  public readonly take!: number;
  
  @ApiProperty({ example: 1 })
  @IsInt()
  public readonly page!: number;

  @ApiProperty({ isArray: true, name: 'names', required: false })
  @IsOptional()
  public readonly names?: string[];
}
