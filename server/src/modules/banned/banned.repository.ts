import { EntityRepository, Repository } from 'typeorm';
import { Visitor } from '../visitor/visitor.entity';
import { Banned } from './banned.entity';

@EntityRepository(Banned)
export class BannedRepository extends Repository<Banned> {
  async getBanned(visitor: Visitor): Promise<Banned | undefined> {
    return await this.createQueryBuilder('banned')
      .where('banned.visitorId = :id', { id: visitor.id })
      .andWhere('banned.bannedTo > :bannedTo', { bannedTo: new Date() })
      .getOne();
  }
}
