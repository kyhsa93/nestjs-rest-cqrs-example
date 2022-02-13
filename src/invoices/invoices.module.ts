import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStoreImplement } from 'src/invoices/infrastructure/cache/event-store';
import { IntegrationEventPublisherImplement } from 'src/invoices/infrastructure/message/integration-event.publisher';
import { InvoiceQueryImplement } from 'src/invoices/infrastructure/queries/invoice.query';
import { InvoiceRepositoryImplement } from 'src/invoices/infrastructure/repositories/invoice.repository';

import { InvoicesController } from 'src/invoices/interface/invoices.controller';

import { CloseInvoiceHandler } from 'src/invoices/application/commands/close-invoice.handler';
import { DepositHandler } from 'src/invoices/application/commands/deposit.handler';
import { OpenInvoiceHandler } from 'src/invoices/application/commands/open-invoice.handler';
import { RemitHandler } from 'src/invoices/application/commands/remit.handler';
import { UpdatePasswordHandler } from 'src/invoices/application/commands/update-password.handler';
import { WithdrawHandler } from 'src/invoices/application/commands/withdraw.handler';
import { InvoiceClosedHandler } from 'src/invoices/application/events/invoice-closed.handler';
import { InvoiceOpenedHandler } from 'src/invoices/application/events/invoice-opened.handler';
import { DepositedHandler } from 'src/invoices/application/events/deposited.handler';
import { PasswordUpdatedHandler } from 'src/invoices/application/events/password-updated.handler';
import { WithdrawnHandler } from 'src/invoices/application/events/withdrawn.handler';
import { FindInvoiceByIdHandler } from 'src/invoices/application/queries/find-invoice-by-id.handler';
import { FindInvoicesHandler } from 'src/invoices/application/queries/find-invoices.handler';

import { InvoiceService } from 'src/invoices/domain/service/service';
import { InvoiceFactory } from 'src/invoices/domain/factory';
import { InjectionToken } from './application/injection.token';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.INVOICE_REPOSITORY,
    useClass: InvoiceRepositoryImplement,
  },
  {
    provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  {
    provide: InjectionToken.EVENT_STORE,
    useClass: EventStoreImplement,
  },
  {
    provide: InjectionToken.INVOICE_QUERY,
    useClass: InvoiceQueryImplement,
  },
];

const application = [
  CloseInvoiceHandler,
  DepositHandler,
  OpenInvoiceHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,
  InvoiceClosedHandler,
  InvoiceOpenedHandler,
  DepositedHandler,
  PasswordUpdatedHandler,
  WithdrawnHandler,
  FindInvoiceByIdHandler,
  FindInvoicesHandler,
];

const domain = [InvoiceService, InvoiceFactory];

@Module({
  imports: [CqrsModule],
  controllers: [InvoicesController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class InvoicesModule {}
