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
        width: data.width,
        height: data.height,
        size: data.size,
        link: data.link,
        token: data.token,
        url: data.url,
        title: data.title,
        description: data.description,
        header: data.header,
        content: data.content,
        subFolder: data.subFolder,
        tinyName: data.tinyName,
        tinyAlt: data.tinyAlt,
        tinyTitle: data.tinyTitle,
        tinyWidth: data.tinyWidth,
        tinyHeight: data.tinyHeight,
        smallName: data.smallName,
        smallAlt: data.smallAlt,
        smallTitle: data.smallTitle,
        smallWidth: data.smallWidth,
        smallHeight: data.smallHeight,
        bigName: data.bigName,
        bigAlt: data.bigAlt,
        bigTitle: data.bigTitle,
        bigWidth: data.bigWidth,
        bigHeight: data.bigHeight,
        mimeId: data.mimeId,
        active: data.active,
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
    const upd: any = {};

    if (data.link !== undefined) {
      upd.link = data.link;
    }

    if (data.token !== undefined) {
      upd.token = data.token;
    }

    if (data.url !== undefined) {
      upd.url = data.url;
    }

    if (data.title !== undefined) {
      upd.title = data.title;
    }

    if (data.description !== undefined) {
      upd.description = data.description;
    }

    if (data.header !== undefined) {
      upd.header = data.header;
    }

    if (data.content !== undefined) {
      upd.content = data.content;
    }

    if (data.subFolder !== undefined) {
      upd.subFolder = data.subFolder;
    }

    if (data.tinyName !== undefined) {
      upd.tinyName = data.tinyName;
    }

    if (data.tinyAlt !== undefined) {
      upd.tinyAlt = data.tinyAlt;
    }

    if (data.tinyTitle !== undefined) {
      upd.tinyTitle = data.tinyTitle;
    }

    if (data.smallName !== undefined) {
      upd.smallName = data.smallName;
    }

    if (data.smallAlt !== undefined) {
      upd.smallAlt = data.smallAlt;
    }

    if (data.smallTitle !== undefined) {
      upd.smallTitle = data.smallTitle;
    }

    if (data.bigName !== undefined) {
      upd.bigName = data.bigName;
    }

    if (data.bigAlt !== undefined) {
      upd.bigAlt = data.bigAlt;
    }

    if (data.bigTitle !== undefined) {
      upd.bigTitle = data.bigTitle;
    }

    if (data.active !== undefined) {
      upd.active = data.active;
    }

    await this.createQueryBuilder()
      .update()
      .where('id = :id', { id: pictureId })
      .set(upd)
      .execute();
  }
}
