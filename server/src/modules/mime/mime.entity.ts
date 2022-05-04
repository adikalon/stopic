import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
import { bigint } from './../../common/functions/entity';

@Entity()
export class Mime {
  @Generated('increment')
  @PrimaryColumn('bigint', { unsigned: true, transformer: [bigint] })
  id!: number;

  @Column({ type: 'varchar', length: 5 })
  type!: string;
}
