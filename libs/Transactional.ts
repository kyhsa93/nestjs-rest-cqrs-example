import { ICommandHandler, IEventHandler } from '@nestjs/cqrs';

import { writeConnection } from 'libs/DatabaseModule';
import { RequestStorage } from 'libs/RequestStorage';

export function Transactional() {
  return (
    target: ICommandHandler | IEventHandler,
    key: string,
    descriptor: PropertyDescriptor,
  ): void => {
    const originalMethod = descriptor.value as (...args) => Promise<unknown>;
    descriptor.value = new Proxy(originalMethod, {
      apply: async (proxyTarget, thisArg, args) => {
        if (writeConnection.isTransactionActive)
          RequestStorage.increaseTransactionDepth();
        if (!writeConnection.isTransactionActive) {
          RequestStorage.resetTransactionDepth();
          await writeConnection.startTransaction();
        }
        try {
          const result = await proxyTarget.apply(thisArg, args);

          if (
            writeConnection.isTransactionActive &&
            RequestStorage.getStorage().transactionDepth <= 0
          )
            await writeConnection.commitTransaction();
          if (
            writeConnection.isTransactionActive &&
            0 < RequestStorage.getStorage().transactionDepth
          )
            RequestStorage.decreaseTransactionDepth();
          return result;
        } catch (error) {
          if (
            writeConnection.isTransactionActive &&
            RequestStorage.getStorage().transactionDepth <= 0
          )
            await writeConnection.rollbackTransaction();
          if (
            writeConnection.isTransactionActive &&
            0 < RequestStorage.getStorage().transactionDepth
          )
            RequestStorage.decreaseTransactionDepth();
          throw error;
        }
      },
    });
  };
}
