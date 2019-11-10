import bcrypt from 'bcrypt-nodejs';
import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountCommand } from "../implements/account.command.create";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import Account from "../../../domain/model/account.model";
import CreateAccountMapper from '../../../infrastructure/mapper/account.mapper.create';
import { HttpException, HttpStatus } from "@nestjs/common";

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand): Promise<void> {
    await this.repository.findOne({ where: [{ email: command.email }]}).then((item) => {
      if (item) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    });

    const { name, email, password } = command;
    const result = await this.repository.save(new CreateAccountMapper(name, email, bcrypt.hashSync(password)));

    const account: Account = this.publisher.mergeObjectContext(
      new Account(result.id, name, email, result.password, result.active),
    );
    account.commit();
  }
}
