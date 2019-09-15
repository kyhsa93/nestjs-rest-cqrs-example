import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountCommand } from "./account.command.update";
import { AccountEntity } from "../entity/account.entity";
import { AccountRepository } from "../repository/account.repository";
import { IsNull } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Account } from "../model/account.model";
import { UpdateAccountMapper } from '../mapper/account.mapper.update';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler implements ICommandHandler<UpdateAccountCommand> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<void> {
    const data = await this.repository.findOneOrFail({ where: { account_id: command.accountId, deleted_at: IsNull() } }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const account = this.publisher.mergeObjectContext(new Account(data.account_id, data.name, data.email, data.password, data.active));
    if (!account.comparePassword(command.oldPassword)) throw new HttpException('Bad requeest', HttpStatus.BAD_REQUEST);
    account.password = command.newPassword;
    account.commit();
    await this.repository.update({ account_id: account.accountId }, new UpdateAccountMapper(account));
  }
}