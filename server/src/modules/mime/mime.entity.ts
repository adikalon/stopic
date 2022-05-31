import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  Index,
  OneToMany,
} from 'typeorm';
import { Picture } from '../picture/picture.entity';
import { bigint } from '../../common/functions/entity';

@Entity()
export class Mime {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 15, unique: true })
  type!: string;

  @OneToMany(() => Picture, (picture) => picture.mime)
  pictures!: Picture[];
}
