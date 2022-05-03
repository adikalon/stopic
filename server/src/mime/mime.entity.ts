import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mime {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 5 })
  type!: string;
}
