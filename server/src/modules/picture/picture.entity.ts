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
  JoinColumn,
} from 'typeorm';
import { Mime } from '../mime/mime.entity';
import { bigint } from '../../common/functions/entity';
import { Tag } from '../tag/tag.entity';
import { View } from '../view/view.entity';
import { Download } from '../download/download.entity';

@Entity()
@Check(
  '"width" > 0 AND "height" > 0 AND "size" > 0 AND "tinyWidth" > 0 AND "tinyHeight" > 0 AND "smallWidth" > 0 AND "smallHeight" > 0 AND "bigWidth" > 0 AND "bigHeight" > 0',
)
@Check(
  '"tinyName" != "smallName" AND "tinyName" != "bigName" AND "smallName" != "bigName"',
)
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
  token!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  header!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  subFolder!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  tinyName!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  tinyAlt!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  tinyTitle!: string;

  @Index()
  @Column({ type: 'smallint' })
  tinyWidth!: number;

  @Index()
  @Column({ type: 'smallint' })
  tinyHeight!: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  smallName!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  smallAlt!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  smallTitle!: string;

  @Index()
  @Column({ type: 'smallint' })
  smallWidth!: number;

  @Index()
  @Column({ type: 'smallint' })
  smallHeight!: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  bigName!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  bigAlt!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  bigTitle!: string;

  @Index()
  @Column({ type: 'smallint' })
  bigWidth!: number;

  @Index()
  @Column({ type: 'smallint' })
  bigHeight!: number;

  @ManyToOne(() => Mime, (mime) => mime.pictures, { nullable: false })
  @JoinColumn({ name: 'mimeId', referencedColumnName: 'id' })
  mime!: Mime;

  @Column()
  mimeId!: number;

  @Column({ type: 'boolean' })
  active!: boolean;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @ManyToMany(() => Tag, (tag) => tag.pictures)
  @JoinTable()
  tags!: Tag[];

  @OneToMany(() => View, (view) => view.picture)
  views!: View[];

  @OneToMany(() => Download, (download) => download.picture)
  downloads!: Download[];
}
