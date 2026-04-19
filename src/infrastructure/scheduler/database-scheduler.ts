import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { readConnection, writeConnection } from 'libs/database-module';

@Injectable()
export class DatabaseScheduler {
  private readonly logger = new Logger(DatabaseScheduler.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async databaseHealthCheck(): Promise<void> {
    try {
      await Promise.all([
        writeConnection.manager.query('SELECT 1'),
        readConnection.query('SELECT 1'),
      ]);
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }
}
