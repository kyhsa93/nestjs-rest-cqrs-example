import { addYears } from 'date-fns/addYears';
import { LessThan } from 'typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import {
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  writeConnection,
} from 'libs/database-module';
import { TaskPublisher, TASK_PUBLISHER } from 'libs/message-module';

import { LockAccountCommand } from 'src/account/application/command/lock-account-command';
import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';

@Injectable()
export class AccountScheduler {
  private readonly logger = new Logger(AccountScheduler.name);

  @Inject(TASK_PUBLISHER) private readonly taskPublisher: TaskPublisher;
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async lockUnusedAccount(): Promise<void> {
    try {
      const accounts = await writeConnection.manager
        .getRepository(AccountEntity)
        .findBy({ updatedAt: LessThan(addYears(new Date(), -1)) });

      for (const account of accounts) {
        await this.taskPublisher.publish(
          LockAccountCommand.name,
          new LockAccountCommand(this.entityIdTransformer.from(account.id)),
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
