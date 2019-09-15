import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteAccountCommand } from './account.command.delete';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../entity/account.entity';
import { AccountRepository } from '../repository/account.repository';
import { IsNull } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Account } from '../model/account.model';
import { DeleteAccountMapper } from '../mapper/account.mappter.delete';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    const data = await this.repository.findOneOrFail({ where: { account_id: command.accountId, deleted_at: IsNull() } }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const account = this.publisher.mergeObjectContext(new Account(data.account_id, data.name, data.email, data.password, data.active));
    if (!account.comparePassword(command.password)) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    account.commit();
    await this.repository.update({ account_id: account.accountId }, new DeleteAccountMapper(account));
  }
}
