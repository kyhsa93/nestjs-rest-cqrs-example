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

  @Column({ default: true })
  public active!: boolean;

  @Column({ type: 'datetime' })
  public createdAt!: Date;

  @Column({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'datetime', default: null })
  public deletedAt!: Date;
}
