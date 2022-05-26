import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { bigint } from '../../common/functions/entity';
import { TrashType } from './trash-type.entity';

@Entity()
export class Trash {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  key!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @ManyToOne(() => TrashType, (trashType) => trashType.trash, {
    nullable: false,
  })
  type!: TrashType;
}
