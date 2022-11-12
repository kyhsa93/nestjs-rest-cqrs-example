import { Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { readConnection, writeConnection } from 'libs/DatabaseModule';
import { Config } from 'src/Config';

export class AppService implements OnModuleInit {
  private readonly logger: Logger;

  onModuleInit() {
    // AWS.config.update({
    //   credentials: new AWS.Credentials({ accessKeyId: '', secretAccessKey: '' }),
    //   region: Config.AWS_REGION,
    // })
  }

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
