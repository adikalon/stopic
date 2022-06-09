import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
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
  @JoinColumn({ name: 'visitorId', referencedColumnName: 'id' })
  visitor!: Visitor;

  @Column()
  visitorId!: number;

  @ManyToOne(() => Picture, (picture) => picture.views, { nullable: false })
  @JoinColumn({ name: 'pictureId', referencedColumnName: 'id' })
  picture!: Picture;

  @Column()
  pictureId!: number;

  @Column({ type: 'timestamp' })
  bannedTo!: Date;

  @CreateDateColumn()
  createdDate!: Date;
}
