import { EntityRepository, Repository } from 'typeorm';
import { MimeTypeEnum } from './mime-type.enum';
import { Mime } from './mime.entity';

@EntityRepository(Mime)
export class MimeRepository extends Repository<Mime> {
  async getMimeIdByString(type: MimeTypeEnum): Promise<number> {
    const mime = await this.createQueryBuilder('mime')
      .where('mime.type = :type', { type })
      .getOne();

    if (mime) {
      return mime.id;
    }

    const result = await this.createQueryBuilder()
      .insert()
      .values({ type })
      .returning(['id'])
      .execute();

    const { id } = result.generatedMaps[0] as { id: string };

    return +id;
  }
}
