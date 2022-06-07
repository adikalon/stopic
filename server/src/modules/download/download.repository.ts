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
}
