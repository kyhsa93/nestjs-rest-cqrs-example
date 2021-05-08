import { Account } from "src/accounts/domain/account";
import { DepositedEvent } from "src/accounts/domain/events/deposited.event";
import { WithdrawnEvent } from "src/accounts/domain/events/withdrawn.event";
import { AccountService, RemittanceOptions } from "src/accounts/domain/service";

describe('AccountService', () => {
  describe('remit', () => {
    it('should run remit', () => {
      const service = new AccountService();

      const sender = new Account({
        id: 'senderId',
        name: 'sender',
        balance: 1,
        password: '',
        openedAt: new Date(),
        updatedAt: new Date(),
      });
      sender.setPassword('senderPassword');

      const receiver = new Account({
        id: 'receiverId',
        name: 'receiver',
        balance: 0,
        password: '',
        openedAt: new Date(),
        updatedAt: new Date(),
      });
      receiver.setPassword('receiverPassword');

      const options: RemittanceOptions = { sender, receiver, password: 'senderPassword', amount: 1 }

      expect(service.remit(options)).toEqual(undefined);
      expect(sender.getUncommittedEvents()).toEqual([new WithdrawnEvent('senderId')]);
      expect(receiver.getUncommittedEvents()).toEqual([new DepositedEvent('receiverId')]);
    })
  });
});
