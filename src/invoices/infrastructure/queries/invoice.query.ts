import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { InvoiceEntity } from 'src/invoices/infrastructure/entities/invoice.entity';

import {
  Invoice,
  InvoiceQuery,
  Invoices,
} from 'src/invoices/application/queries/invoice.query';

@Injectable()
export class InvoiceQueryImplement implements InvoiceQuery {
  async findById(id: string): Promise<undefined | Invoice> {
    return this.convertInvoiceFromEntity(
      await getRepository(InvoiceEntity).findOne(id),
    );
  }

  async find(offset: number, limit: number): Promise<Invoices> {
    return this.convertInvoicesFromEntities(
      await getRepository(InvoiceEntity).find({ skip: offset, take: limit }),
    );
  }

  private convertInvoiceFromEntity(
    entity?: InvoiceEntity,
  ): undefined | Invoice {
    return entity
      ? { ...entity, openedAt: entity.createdAt, closedAt: entity.deletedAt }
      : undefined;
  }

  private convertInvoicesFromEntities(entities: InvoiceEntity[]): Invoices {
    return entities.map((entity) => ({
      ...entity,
      openedAt: entity.createdAt,
      closedAt: entity.deletedAt,
    }));
  }
}
