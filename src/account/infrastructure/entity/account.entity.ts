import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500, unique: true, name: 'account_id' })
  accountId!: string

  @Column({ length: 500 })
  name!: string

  @Column({ length: 500, unique: true })
  email!: string

  @Column({ length: 500 })
  password!: string

  @Column({ type: "bool", default: true })
  active!: boolean

  @Column({ type: "datetime", name: 'created_at' })
  createdAt!: string;

  @Column({ type: "timestamp", default: null, name: 'updated_at' })
  updatedAt!: string;

  @Column({ type: "datetime", default: null, name: 'deleted_at' })
  deletedAt!: string;
}
