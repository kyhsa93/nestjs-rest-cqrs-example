import { getRepository, In } from 'typeorm';
import { Inject } from '@nestjs/common';

import { InvoiceEntity } from 'src/invoices/infrastructure/entities/invoice.entity';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';
import { Invoice } from 'src/invoices/domain/entity/invoice';
import { InvoiceFactory } from 'src/invoices/domain/factory';

export class InvoiceRepositoryImplement implements InvoiceRepository {
  constructor(
    @Inject(InvoiceFactory) private readonly invoiceFactory: InvoiceFactory,
  ) {}

  async newId(): Promise<string> {
    const emptyEntity = new InvoiceEntity();
    const entity = await getRepository(InvoiceEntity).save(emptyEntity);
    return entity.id;
  }

  async save(data: Invoice | Invoice[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await getRepository(InvoiceEntity).save(entities);
  }

  async findById(id: string): Promise<Invoice | null> {
    const entity = await getRepository(InvoiceEntity).findOne({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByIds(ids: string[]): Promise<Invoice[]> {
    const entities = await getRepository(InvoiceEntity).find({ id: In(ids) });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByName(name: string): Promise<Invoice[]> {
    const entities = await getRepository(InvoiceEntity).find({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Invoice): InvoiceEntity {
    const properties = model.properties();
    return {
      ...properties,
      createdAt: properties.openedAt,
      deletedAt: properties.closedAt,
    };
  }

  private entityToModel(entity: InvoiceEntity): Invoice {
    return this.invoiceFactory.reconstitute({
      ...entity,
      openedAt: entity.createdAt,
      closedAt: entity.deletedAt,
    });
  }
}
