import PasswordEntity from 'src/account/infrastructure/entity/password.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export default class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public email!: string;
  
  @OneToOne(() => PasswordEntity)
  public password!: PasswordEntity;

  @Column({ type: 'datetime' })
  public createdAt!: Date;

  @Column({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'datetime', default: null, nullable: true })
  public deletedAt?: Date;
}
