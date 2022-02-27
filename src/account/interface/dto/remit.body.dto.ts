import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RemitBodyDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly receiverId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ minimum: 1 })
  readonly amount: number;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({ minLength: 8, maxLength: 20, example: 'password' })
  readonly password: string;
}
