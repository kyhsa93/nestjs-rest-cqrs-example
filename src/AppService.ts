import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { readConnection, writeConnection } from 'libs/DatabaseModule';

export class AppService {
  private readonly logger = new Logger(AppService.name);

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
