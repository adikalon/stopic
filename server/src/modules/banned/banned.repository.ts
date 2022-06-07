import { EntityRepository, Repository } from 'typeorm';
import { Banned } from './banned.entity';

@EntityRepository(Banned)
export class BannedRepository extends Repository<Banned> {
  async getBannedTo(visitorId: number): Promise<Date | undefined> {
    const entity = await this.createQueryBuilder('banned')
      .where('banned.visitorId = :id', { id: visitorId })
      .andWhere('banned.bannedTo > :bannedTo', { bannedTo: new Date() })
      .getOne();

    if (!entity) {
      return undefined;
    }

    return entity.bannedTo;
  }
}
