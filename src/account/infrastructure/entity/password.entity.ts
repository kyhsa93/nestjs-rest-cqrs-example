import { Column, Entity } from 'typeorm';

@Entity()
export default class PasswordEntity {
  @Column('varchar')
  public encrypted!: string;

  @Column('varchar')
  public salt!: string;

  @Column('datetime')
  public createdAt!: Date;

  @Column('datetime')
  public comparedAt!: Date;
}
