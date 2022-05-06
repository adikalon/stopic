import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Visitor } from '../visitor/visitor.entity';
import { bigint } from '../../common/functions/entity';

@Entity()
export class Banned {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @ManyToOne(() => Visitor, (visitor) => visitor.banneds, { nullable: false })
  visitor!: Visitor;

  @Column({ type: 'timestamp' })
  bannedTo!: Date;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;
}
