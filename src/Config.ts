import { Logger } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsString()
  readonly AWS_REGION = process.env.AWS_REGION as string;

  @IsOptional()
  @IsString()
  readonly AWS_ENDPOINT = process.env.AWS_ENDPOINT;

  @IsString()
  readonly AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;

  @IsString()
  readonly AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

  @IsString()
  readonly AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL as string;

  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true';

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === 'true';

  @IsEmail()
  readonly EMAIL = process.env.EMAIL as string;

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
