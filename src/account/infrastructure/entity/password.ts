import { Column } from 'typeorm';

export default class PasswordEntity {
  @Column('varchar', { nullable: true })
  public encrypted!: string;

  @Column('varchar', { nullable: true })
  public salt!: string;

  @Column('datetime', { nullable: true })
  public createdAt!: Date;

  @Column('datetime', { nullable: true })
  public comparedAt!: Date;
}
