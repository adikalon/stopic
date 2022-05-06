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
  OneToMany,
} from 'typeorm';
import { Mime } from '../mime/mime.entity';
import { bigint } from '../../common/functions/entity';
import { Tag } from '../tag/tag.entity';
import { View } from '../view/view.entity';
import { Download } from '../download/download.entity';

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
  @Column({ type: 'varchar', length: 255, unique: true })
  link!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  hash!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  header!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  altFull!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  altPreview!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  nameFull!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  namePreview!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  titleMeta!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  titleAttribute!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  descriptionPage!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  descriptionMeta!: string;

  @ManyToOne(() => Mime, (mime) => mime.pictures, { nullable: false })
  mime!: Mime;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @ManyToMany(() => Tag, (tag) => tag.pictures)
  @JoinTable()
  tags!: Tag[];

  @OneToMany(() => View, (view) => view.visitor)
  views!: View[];

  @OneToMany(() => Download, (download) => download.visitor)
  downloads!: Download[];
}
