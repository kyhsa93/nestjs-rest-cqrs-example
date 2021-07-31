import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/accounts/infrastructure/entities/base.entity';

@Entity()
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string = '';

  @Column()
  password: string = '';

  @Column()
  balance: number = 0;
}
