import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class OpenAccountBodyDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ minLength: 2, maxLength: 8, example: 'young' })
  readonly name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({ minLength: 8, maxLength: 20, example: 'password' })
  readonly password: string;
}
