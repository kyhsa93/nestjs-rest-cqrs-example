import { NotFoundException, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { EventPublisher } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";

import RemittanceCommandHandler from "@src/account/application/command/handlers/remittance";
import RemittanceCommand from "@src/account/application/command/implements/remittance";

import AccountRepository from "@src/account/domain/repository";
import AccountDomainService from "@src/account/domain/service";

jest.mock('typeorm', () => ({ Transaction: () => () => {} }));

describe('RemittanceCommandHandler', () => {
  let accountDomainService: AccountDomainService;
  let eventPublisher: EventPublisher;
  let accountRepository: AccountRepository;
  let remittanceCommandHandler: RemittanceCommandHandler;

  beforeEach(async () => {
    const accountDomainServiceProvider: Provider = { provide: AccountDomainService, useValue: {} };
    const accountRepositoryProvider: Provider = { provide: 'AccountRepositoryImplement', useValue: {} };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountDomainServiceProvider,
      accountRepositoryProvider,
      eventPublisherProvider,
      RemittanceCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountDomainService = testModule.get(AccountDomainService);
    eventPublisher = testModule.get(EventPublisher);
    accountRepository = testModule.get('AccountRepositoryImplement');
    remittanceCommandHandler = testModule.get(RemittanceCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when sender account is not found', async () => {
      const command = new RemittanceCommand('senderId', 'receiverId', 'password', 0);

      accountRepository.findById = jest.fn().mockResolvedValue(undefined);

      await expect(remittanceCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when receiver account is not found', async () => {
      const command = new RemittanceCommand('senderId', 'receiverId', 'password', 0);

      accountRepository.findById = jest.fn().mockResolvedValueOnce({} as Account);

      await expect(remittanceCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should return Promise<void> when success', async () => {
      const command = new RemittanceCommand('senderId', 'receiverId', 'password', 0);

      const account = { commit: () => undefined } as unknown as Account;
      accountRepository.findById = jest.fn().mockResolvedValue(account);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      accountDomainService.remit = jest.fn().mockReturnValue(undefined);
      accountRepository.save = jest.fn().mockResolvedValue(undefined);

      await expect(remittanceCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
