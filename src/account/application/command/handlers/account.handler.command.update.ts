import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountCommand } from "../implements/account.command.update";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import { IsNull } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import Account from "../../../domain/model/account.model";
import UpdateAccountMapper from '../../../infrastructure/mapper/account.mapper.update';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler implements ICommandHandler<UpdateAccountCommand> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<void> {
    const data = await this.repository.findOneOrFail({ accountId: command.accountId, deletedAt: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const account = this.publisher.mergeObjectContext(new Account(data.accountId, data.name, data.email, data.password, data.active));
    account.updatePassoword(command.oldPassword, command.newPassword);
    account.commit();
    await this.repository.update({ accountId: account.accountId }, new UpdateAccountMapper(account));
  }
}