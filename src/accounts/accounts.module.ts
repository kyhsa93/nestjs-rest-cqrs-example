import { Module } from '@nestjs/common';
import { AccountsController } from 'src/accounts/interface/accounts.controller';

@Module({
  controllers: [AccountsController],
})
export class AccountsModule {}
