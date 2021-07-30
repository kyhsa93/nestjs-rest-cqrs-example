import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { WithdrawCommand } from 'src/accounts/application/commands/withdraw.command';
import { WithdrawHandler } from 'src/accounts/application/commands/withdraw.handler';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('WithdrawHandler', () => {
  let handler: WithdrawHandler;
  let repository: AccountRepository;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: EventPublisher,
      useValue: {},
    };
    const providers: Provider[] = [
      WithdrawHandler,
      repoProvider,
      publisherProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(WithdrawHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(undefined);

      const command = new WithdrawCommand({ id: 'accountId', password: 'password', amount: 1 });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute WithdrawCommand', async () => {
      const account = { withdraw: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue({});
      repository.save = jest.fn().mockResolvedValue(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue(account);

      const command = new WithdrawCommand({ id: 'accountId', password: 'password', amount: 1 });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(publisher.mergeObjectContext).toBeCalledTimes(1);
      expect(publisher.mergeObjectContext).toBeCalledWith({});
      expect(account.withdraw).toBeCalledTimes(1);
      expect(account.withdraw).toBeCalledWith(command.amount, command.password);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
