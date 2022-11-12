import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OpenAccountRequestDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ minLength: 2, maxLength: 8, example: 'young' })
  readonly name: string;

  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  readonly email: string;

  @IsAlphanumeric()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({ minLength: 8, maxLength: 20, example: 'password' })
  readonly password: string;
}
