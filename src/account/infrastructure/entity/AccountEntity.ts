import { Entity, Column, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/account/infrastructure/entity/BaseEntity';

@Entity()
export class AccountEntity extends BaseEntity {
  @PrimaryColumn({ type: 'binary', length: 16 })
  id: Buffer;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  balance: number;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  lockedAt: Date | null;
}
