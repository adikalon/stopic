import { EntityRepository, Repository } from 'typeorm';
import { TrashTypeEnum } from './trash-type.enum';
import { Trash } from './trash.entity';

@EntityRepository(Trash)
export class TrashRepository extends Repository<Trash> {
  async inTrash(typeId: TrashTypeEnum, key: string): Promise<void> {
    await this.createQueryBuilder().insert().values({ typeId, key }).execute();
  }
}
