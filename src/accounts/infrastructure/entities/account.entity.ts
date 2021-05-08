import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  balance!: number;

  @Column({ type: 'datetime' })
  openedAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ type: 'datetime', default: null, nullable: true })
  closedAt?: Date;
}
