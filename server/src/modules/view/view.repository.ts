import { EntityRepository, Repository } from 'typeorm';
import { View } from './view.entity';

@EntityRepository(View)
export class ViewRepository extends Repository<View> {
  async increase(visitorId: number, pictureId: number): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .values({ visitorId, pictureId })
      .execute();
  }

  async getCount(pictureId: number): Promise<number> {
    return await this.createQueryBuilder('view')
      .where('view.pictureId = :pictureId', { pictureId })
      .getCount();
  }
}
