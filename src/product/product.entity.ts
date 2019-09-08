import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500 })
  product_id!: string;

  @Column({ length: 500 })
  name!: string;

  @Column('text')
  description!: string;

  @Column({ type: "datetime" })
  created_at!: string;

  @Column({ type: "timestamp", default: null })
  updated_at!: string;

  @Column({ type: "datetime", default: null })
  deleted_at?: string;
}
