import { EntityRepository, Repository } from 'typeorm';
import { VisitorDto } from './visitor.dto';
import { Visitor } from './visitor.entity';

@EntityRepository(Visitor)
export class VisitorRepository extends Repository<Visitor> {
  async getByIpAndUserAgent(
    ip: string,
    userAgent: string,
  ): Promise<VisitorDto | undefined> {
    const entity = await this.createQueryBuilder('visitor')
      .where('visitor.ip = :ip', { ip })
      .andWhere('visitor.userAgent = :userAgent', { userAgent })
      .getOne();

    if (!entity) {
      return undefined;
    }

    return {
      id: entity.id,
      ip: entity.ip,
      userAgent: entity.userAgent,
    };
  }

  async registerAndGet(ip: string, userAgent: string): Promise<VisitorDto> {
    const result = await this.createQueryBuilder()
      .insert()
      .values({ ip, userAgent })
      .returning(['id', 'ip', 'userAgent'])
      .execute();

    const map = result.generatedMaps[0] as {
      id: string;
      ip: string;
      userAgent: string;
    };

    return {
      id: +map.id,
      ip: map.ip,
      userAgent: map.userAgent,
    };
  }

  async touchById(id: number): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({ updatedDate: () => 'NOW()' })
      .where('id = :id', { id })
      .execute();
  }
}
