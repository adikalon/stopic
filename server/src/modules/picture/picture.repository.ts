import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { CreateInterface } from './interfaces/create.interface';
import { EditInterface } from './interfaces/edit.interface';
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
      .addAndRemove(tags, tags);
  }

  async getByToken(token: string): Promise<Picture | undefined> {
    return await this.createQueryBuilder('picture')
      .where('picture.token = :token', { token })
      .andWhere('picture.active = :active', { active: true })
      .leftJoinAndSelect('picture.mime', 'mime')
      .getOne();
  }

  async getById(id: number): Promise<Picture | undefined> {
    return await this.createQueryBuilder('picture')
      .where('picture.id = :id', { id })
      .leftJoinAndSelect('picture.mime', 'mime')
      .getOne();
  }

  async edit(picture: Picture, data: EditInterface): Promise<UpdateResult> {
    let query = this.createQueryBuilder()
      .update()
      .where('id = :id', { id: picture.id })
      .returning('*');

    if (data.active !== undefined) {
      query = query.set({ active: data.active });
    }

    if (data.url !== undefined) {
      query = query.set({ url: data.url });
    }

    if (data.header !== undefined) {
      query = query.set({ header: data.header });
    }

    if (data.altFull !== undefined) {
      query = query.set({ altFull: data.altFull });
    }

    if (data.altPreview !== undefined) {
      query = query.set({ altPreview: data.altPreview });
    }

    if (data.nameFull !== undefined) {
      query = query.set({ nameFull: data.nameFull });
    }

    if (data.namePreview !== undefined) {
      query = query.set({ namePreview: data.namePreview });
    }

    if (data.titleMeta !== undefined) {
      query = query.set({ titleMeta: data.titleMeta });
    }

    if (data.titleAttribute !== undefined) {
      query = query.set({ titleAttribute: data.titleAttribute });
    }

    if (data.descriptionPage !== undefined) {
      query = query.set({ descriptionPage: data.descriptionPage });
    }

    if (data.descriptionMeta !== undefined) {
      query = query.set({ descriptionMeta: data.descriptionMeta });
    }

    return await query.execute();
  }
}
