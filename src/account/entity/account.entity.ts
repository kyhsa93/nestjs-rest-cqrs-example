import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500, unique: true })
  accountId!: string

  @Column({ length: 500 })
  name!: string

  @Column({ length: 500, unique: true })
  email!: string

  @Column({ length: 500 })
  password!: string

  @Column({ type: "bool", default: true })
  active!: boolean

  @Column({ type: "datetime" })
  created_at!: string;

  @Column({ type: "timestamp", default: null })
  updated_at!: string;

  @Column({ type: "datetime", default: null })
  deleted_at!: string;
}
