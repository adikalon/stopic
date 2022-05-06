import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { Picture } from '../picture/picture.entity';
import { bigint } from '../../common/functions/entity';

@Entity()
export class Tag {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @ManyToMany(() => Picture, (picture) => picture.tags)
  pictures!: Picture[];
}
