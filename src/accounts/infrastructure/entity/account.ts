import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public password!: string;

  @Column()
  public balance!: number;

  @Column({ type: 'datetime' })
  public openedAt!: Date;

  @Column({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'datetime', default: null, nullable: true })
  public closedAt!: Date | undefined;
}
