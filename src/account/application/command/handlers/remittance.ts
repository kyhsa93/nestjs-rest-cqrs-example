import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Transaction } from "typeorm";
import { Inject, NotFoundException } from "@nestjs/common";

import RemittanceCommand from "@src/account/application/command/implements/remittance";

import AccountDomainService from "@src/account/domain/service";
import AccountRepository from "@src/account/domain/repository";

export default class RemittanceCommandHandler implements ICommandHandler<RemittanceCommand> {
  constructor(
    private readonly accountDomainService: AccountDomainService,
    private readonly eventPublisher: EventPublisher,
    @Inject('AccountRepositoryImplement') private readonly accountRepository: AccountRepository,
  ) {}

  @Transaction()
  public async execute(command: RemittanceCommand): Promise<void> {
    const { senderId } = command;
    const senderObject = await this.accountRepository.findById(senderId);
    if (!senderObject) {
      throw new NotFoundException('Sender account is not found');
    }

    const { receiverId } = command
    const receiverObject = await this.accountRepository.findById(receiverId);
    if (!receiverObject) {
      throw new NotFoundException('Receiver account is not found');
    }

    const sender = this.eventPublisher.mergeObjectContext(senderObject);
    const receiver = this.eventPublisher.mergeObjectContext(receiverObject);

    const { password, amount } = command;
    this.accountDomainService.remit({ sender, receiver, password, amount });

    await this.accountRepository.save([sender, receiver]);
  }
}
