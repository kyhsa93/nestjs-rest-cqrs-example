import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import PasswordEntity from '@src/account/infrastructure/entity/password';

@Entity()
export default class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column(() => PasswordEntity)
  public password!: PasswordEntity;

  @Column()
  public balance!: number;

  @Column({ type: 'datetime' })
  public openedAt!: Date;

  @Column({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'datetime', default: null, nullable: true })
  public closedAt!: Date | undefined;
}
