import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Visitor } from './visitor.entity';

@EntityRepository(Visitor)
export class VisitorRepository extends Repository<Visitor> {
  async getByIpAndUserAgent(
    ip: string,
    userAgent: string,
  ): Promise<Visitor | undefined> {
    return await this.createQueryBuilder('visitor')
      .where('visitor.ip = :ip', { ip })
      .andWhere('visitor.userAgent = :userAgent', { userAgent })
      .getOne();
  }

  async register(ip: string, userAgent: string): Promise<InsertResult> {
    return await this.createQueryBuilder()
      .insert()
      .values({ ip, userAgent })
      .execute();
  }

  async touchById(id: number): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update()
      .set({ updatedDate: () => 'NOW()' })
      .where('id = :id', { id })
      .execute();
  }
}
