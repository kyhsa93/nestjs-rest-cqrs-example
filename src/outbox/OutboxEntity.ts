import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('outbox')
export class OutboxEntity {
  @PrimaryColumn({ type: 'char', length: 32 })
  eventId: string;

  @Column({ type: 'varchar', length: 100 })
  eventType: string;

  @Column({ type: 'text' })
  payload: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
