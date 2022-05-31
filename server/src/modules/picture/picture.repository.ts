import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { CreateInterface } from './interfaces/create.interface';
import { Picture } from './picture.entity';

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  async createAndGetResult(data: CreateInterface): Promise<InsertResult> {
    return this.createQueryBuilder()
      .insert()
      .values({
        active: data.active,
        width: data.width,
        height: data.height,
        size: data.size,
        hash: data.hash,
        url: data.url,
        subFolder: data.subFolder,
        header: data.header,
        altFull: data.altFull,
        altPreview: data.altPreview,
        nameFull: data.nameFull,
        namePreview: data.namePreview,
        titleMeta: data.titleMeta,
        titleAttribute: data.titleAttribute,
        descriptionPage: data.descriptionPage,
        descriptionMeta: data.descriptionMeta,
        mimeId: data.mime.id,
      })
      .returning('*')
      .execute();
  }
}
