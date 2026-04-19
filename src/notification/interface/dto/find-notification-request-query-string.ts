import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindNotificationRequestQueryString {
  @ApiProperty({ example: 0, default: 0, required: false, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly skip: number = 0;

  @ApiProperty({
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  readonly take: number = 10;

  @ApiProperty({ example: 'test@test.com', required: false })
  @IsOptional()
  @IsEmail()
  readonly to: string;
}
