import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/account/infrastructure/entity/base.entity';

@Entity()
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  password = '';

  @Column({ type: 'int' })
  balance = 0;
}
