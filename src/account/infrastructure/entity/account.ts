import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import PasswordEntity from '@src/account/infrastructure/entity/password';

@Entity()
export default class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public email!: string;

  @Column(() => PasswordEntity)
  public password!: PasswordEntity;

  @Column({ type: 'datetime' })
  public createdAt!: Date;

  @Column({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'datetime', default: null, nullable: true })
  public deletedAt!: Date | undefined;
}
