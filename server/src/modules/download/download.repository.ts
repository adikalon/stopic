import { EntityRepository, Repository } from 'typeorm';
import { Download } from './download.entity';

@EntityRepository(Download)
export class DownloadRepository extends Repository<Download> {
  async increase(visitorId: number, pictureId: number): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .values({ visitorId, pictureId })
      .execute();
  }

  async getCount(pictureId: number): Promise<number> {
    return await this.createQueryBuilder('download')
      .where('download.pictureId = :pictureId', { pictureId })
      .getCount();
  }
}
