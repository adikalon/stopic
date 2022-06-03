import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { CreateInterface } from './interfaces/create.interface';
import { Picture } from './picture.entity';

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  async createAndGetResult(data: CreateInterface): Promise<InsertResult> {
    return await this.createQueryBuilder()
      .insert()
      .values({
        active: data.active,
        width: data.width,
        height: data.height,
        size: data.size,
        link: data.link,
        token: data.token,
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
        widthPreviewTiny: data.widthPreviewTiny,
        heightPreviewTiny: data.heightPreviewTiny,
        widthPreviewSmall: data.widthPreviewSmall,
        heightPreviewSmall: data.heightPreviewSmall,
        widthPreviewBig: data.widthPreviewBig,
        heightPreviewBig: data.heightPreviewBig,
        mimeId: data.mime.id,
      })
      .returning('*')
      .execute();
  }

  async attachTags(tags: Tag[], pictureId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Picture, 'tags')
      .of(pictureId)
      .add(tags);
  }
}
