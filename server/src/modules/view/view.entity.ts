import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Visitor } from '../visitor/visitor.entity';
import { Picture } from '../picture/picture.entity';
import { bigint } from '../../common/functions/entity';

@Entity()
export class View {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @ManyToOne(() => Visitor, (visitor) => visitor.views, { nullable: false })
  visitor!: Visitor;

  @ManyToOne(() => Picture, (picture) => picture.views, { nullable: false })
  picture!: Picture;

  @Column({ type: 'timestamp' })
  bannedTo!: Date;

  @CreateDateColumn()
  createdDate!: Date;
}
