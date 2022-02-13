import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/invoices/infrastructure/entities/base.entity';

@Entity()
export class InvoiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  password = '';

  @Column({ type: 'int' })
  status = 0;
}
