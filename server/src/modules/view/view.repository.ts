import { EntityRepository, Repository } from 'typeorm';
import { View } from './view.entity';

@EntityRepository(View)
export class ViewRepository extends Repository<View> {
  async getCount(pictureId: number): Promise<number> {
    return await this.createQueryBuilder('view')
      .where('view.pictureId = :pictureId', { pictureId })
      .getCount();
  }
}
