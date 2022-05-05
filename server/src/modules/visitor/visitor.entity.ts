import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';
import { Banned } from './../banned/banned.entity';
import { bigint } from './../../common/functions/entity';
import { View } from './../view/view.entity';

@Entity()
@Unique(['ip', 'userAgent'])
export class Visitor {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 105 })
  ip!: string;

  @Index()
  @Column({ type: 'varchar', length: 505 })
  userAgent!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;

  @OneToMany(() => Banned, (banned) => banned.visitor)
  banneds!: Banned[];

  @OneToMany(() => View, (view) => view.visitor)
  views!: View[];
}
