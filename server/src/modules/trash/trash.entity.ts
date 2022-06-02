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
  JoinColumn,
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

  @Column()
  typeId!: number;

  @ManyToOne(() => TrashType, (trashType) => trashType.trash, {
    nullable: false,
  })
  @JoinColumn({ name: 'typeId', referencedColumnName: 'id' })
  type!: TrashType;
}
