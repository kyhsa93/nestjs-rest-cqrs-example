import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountCommand } from "./account.command.create";
import { AccountRepository } from "../repository/account.repository";
import { AccountEntity } from "../entity/account.entity";
import { Account } from "../model/account.model";
import { CreateAccountMapper } from '../mapper/account.mapper.create';
import { HttpException, HttpStatus } from "@nestjs/common";

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand): Promise<void> {
    await this.repository.findOne({ where: [{ account_id: command.account_id }, { email: command.email }]}).then((item) => {
      if (!!item) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    });
    const account = this.publisher.mergeObjectContext(new Account(command.account_id, command.name, command.email, command.password, command.active));
    account.password = command.password;
    account.commit();
    await this.repository.save(new CreateAccountMapper(account));
  }
}
