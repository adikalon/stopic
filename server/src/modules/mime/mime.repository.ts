import { EntityRepository, Repository } from 'typeorm';
import { MimeTypeEnum } from './mime-type.enum';
import { Mime } from './mime.entity';

@EntityRepository(Mime)
export class MimeRepository extends Repository<Mime> {
  async getMimeByString(type: MimeTypeEnum): Promise<Mime> {
    let mime = await this.createQueryBuilder('mime')
      .where('mime.type = :type', { type })
      .getOne();

    if (!mime) {
      await this.createQueryBuilder().insert().values({ type }).execute();
      mime = await this.createQueryBuilder('mime')
        .where('mime.type = :type', { type })
        .getOne();

      if (!mime) {
        throw new Error('MimeType not found');
      }
    }

    return mime;
  }
}
