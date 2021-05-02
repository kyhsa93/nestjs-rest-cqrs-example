import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RemitBodyDTO {
  @IsString()
  @IsNotEmpty()
  readonly receiverId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
