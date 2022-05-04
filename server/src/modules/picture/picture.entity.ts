import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  Check,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Mime } from './../mime/mime.entity';
import { bigint } from './../../common/functions/entity';
import { Tag } from './../tag/tag.entity';

@Entity()
@Check('"width" > 0 AND "height" > 0 AND "size" > 0')
export class Picture {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'smallint' })
  width!: number;

  @Index()
  @Column({ type: 'smallint' })
  height!: number;

  @Index()
  @Column({ type: 'integer' })
  size!: number;

  @Index()
  @Column({ type: 'varchar', length: 30, unique: true })
  link!: string;

  @ManyToOne(() => Mime, (mime) => mime.pictures, { nullable: false })
  mime!: Mime;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @ManyToMany(() => Tag, (tag) => tag.pictures)
  @JoinTable({ name: 'picture_tag' })
  tags!: Tag[];
}
