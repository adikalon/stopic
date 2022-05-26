import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  Index,
  OneToMany,
} from 'typeorm';
import { bigint } from '../../common/functions/entity';
import { Trash } from './trash.entity';

@Entity()
export class TrashType {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @OneToMany(() => Trash, (trash) => trash.type)
  trash!: Trash[];
}
