import { EntityRepository, Repository } from 'typeorm';
import { Picture } from '../picture/picture.entity';
import { Visitor } from '../visitor/visitor.entity';
import { Download } from './download.entity';

@EntityRepository(Download)
export class DownloadRepository extends Repository<Download> {
  async increase(visitor: Visitor, picture: Picture): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .values({ visitorId: visitor.id, pictureId: picture.id })
      .execute();
  }
}
