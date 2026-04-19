import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryColumn({ type: 'binary', length: 16 })
  id: Buffer;

  @Column({ type: 'binary', length: 16 })
  accountId: Buffer;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
