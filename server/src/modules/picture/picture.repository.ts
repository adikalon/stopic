import { EntityRepository, Repository } from 'typeorm';
import { PictureDataDto } from './dto/picture-data.dto';
import { CreateInterface } from './interfaces/create.interface';
import { EditInterface } from './interfaces/edit.interface';
import { Picture } from './picture.entity';

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  async createAndGetId(data: CreateInterface): Promise<number> {
    const result = await this.createQueryBuilder()
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
        mimeId: data.mimeId,
      })
      .returning(['id'])
      .execute();

    const { id } = result.generatedMaps[0] as { id: string };

    return +id;
  }

  async attachTags(
    pictureId: number,
    attached: number[],
    detached: number[] = [],
  ): Promise<void> {
    await this.createQueryBuilder()
      .relation(Picture, 'tags')
      .of(pictureId)
      .addAndRemove(attached, detached);
  }

  async getByToken(token: string): Promise<PictureDataDto | undefined> {
    const entity = await this.createQueryBuilder('picture')
      .where('picture.token = :token', { token })
      .leftJoinAndSelect('picture.mime', 'mime')
      .leftJoinAndSelect('picture.tags', 'tags')
      .getOne();

    if (!entity) {
      return undefined;
    }

    return {
      id: entity.id,
      subFolder: entity.subFolder,
      mime: { id: entity.mime.id, type: entity.mime.type },
      tags: entity.tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
  }

  async getById(id: number): Promise<PictureDataDto | undefined> {
    const entity = await this.createQueryBuilder('picture')
      .where('picture.id = :id', { id })
      .leftJoinAndSelect('picture.mime', 'mime')
      .leftJoinAndSelect('picture.tags', 'tags')
      .getOne();

    if (!entity) {
      return undefined;
    }

    return {
      id: entity.id,
      subFolder: entity.subFolder,
      mime: { id: entity.mime.id, type: entity.mime.type },
      tags: entity.tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
  }

  async edit(pictureId: number, data: EditInterface): Promise<void> {
    let query = this.createQueryBuilder()
      .update()
      .where('id = :id', { id: pictureId })
      .returning(['id']);

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

    await query.execute();
  }
}
