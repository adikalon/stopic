import { EntityRepository, Repository } from 'typeorm';
import { Download } from '../download/download.entity';
import { View } from '../view/view.entity';
import { ItemsDto } from './dto/items.dto';
import { PictureDataDto } from './dto/picture-data.dto';
import { RecommendedDto } from './dto/recommended.dto';
import { SitemapDto } from './dto/sitemap.dto';
import { CreateInterface } from './interfaces/create.interface';
import { EditInterface } from './interfaces/edit.interface';
import { ItemsInterface } from './interfaces/items.interface';
import { Picture } from './picture.entity';
import { SortEnum } from './sort.enum';

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

  async getByToken(
    token: string,
  ): Promise<{ id: number; subFolder: string; mime: string } | undefined> {
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
      mime: entity.mime.type,
    };
  }

  async getById(id: number, del = false): Promise<PictureDataDto | undefined> {
    let query = this.createQueryBuilder('picture')
      .where('picture.id = :id', { id })
      .andWhere('picture.active = :active', { active: true })
      .leftJoinAndSelect('picture.mime', 'mime')
      .leftJoinAndSelect('picture.tags', 'tags');

    if (del) {
      query = query.withDeleted();
    }

    const entity = await query.getOne();

    if (!entity) {
      return undefined;
    }

    return {
      id: entity.id,
      width: entity.width,
      height: entity.height,
      size: entity.size,
      link: entity.link,
      url: entity.url,
      title: entity.title,
      description: entity.description,
      header: entity.header,
      content: entity.content,
      subFolder: entity.subFolder,
      tinyName: entity.tinyName,
      tinyAlt: entity.tinyAlt,
      tinyTitle: entity.tinyTitle,
      tinyWidth: entity.tinyWidth,
      tinyHeight: entity.tinyHeight,
      smallName: entity.smallName,
      smallAlt: entity.smallAlt,
      smallTitle: entity.smallTitle,
      smallWidth: entity.smallWidth,
      smallHeight: entity.smallHeight,
      bigName: entity.bigName,
      bigAlt: entity.bigAlt,
      bigTitle: entity.bigTitle,
      bigWidth: entity.bigWidth,
      bigHeight: entity.bigHeight,
      mime: entity.mime.type,
      createdDate: entity.createdDate,
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

  async getRecommended(
    pictureId: number,
    limit: number,
  ): Promise<RecommendedDto[]> {
    return (await this.createQueryBuilder('picture')
      .leftJoin('picture.tags', 'tag')
      .groupBy('picture.id')
      .where('picture.id != :id', { id: pictureId })
      .andWhere(
        'tag.id IN ' +
          this.createQueryBuilder()
            .subQuery()
            .select('tag.id')
            .where('picture.id = :id', { id: pictureId })
            .from(Picture, 'picture')
            .leftJoin('picture.tags', 'tag')
            .getQuery(),
      )
      .select([
        '"picture"."id" AS "id"',
        '"picture"."width" AS "width"',
        '"picture"."height" AS "height"',
        '"picture"."size" AS "size"',
        '"picture"."link" AS "link"',
        '"picture"."url" AS "url"',
        '"picture"."header" AS "header"',
        '"picture"."tinyName" AS "tinyName"',
        '"picture"."tinyAlt" AS "tinyAlt"',
        '"picture"."tinyTitle" AS "tinyTitle"',
        '"picture"."tinyWidth" AS "tinyWidth"',
        '"picture"."tinyHeight" AS "tinyHeight"',
        '"picture"."createdDate" AS "createdDate"',
        '"picture"."mimeId" AS "mimeId"',
        'COUNT("picture"."id") AS "coincidences"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(download.id)')
          .from(Download, 'download')
          .where('download.pictureId = picture.id');
      }, 'downloads')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(view.id)')
          .from(View, 'view')
          .where('view.pictureId = picture.id');
      }, 'views')
      .limit(limit)
      .orderBy('coincidences', 'DESC')
      .addOrderBy('downloads', 'DESC')
      .addOrderBy('views', 'DESC')
      .execute()) as RecommendedDto[];
  }

  async getItems(
    params: ItemsInterface,
  ): Promise<{ count: number; recs: ItemsDto[] }> {
    const direction = params.direction.toUpperCase() as 'ASC' | 'DESC';
    let query = this.createQueryBuilder('picture')
      .leftJoin('picture.tags', 'tag')
      .select([
        'picture.id AS "id"',
        'picture.width AS "width"',
        'picture.height AS "height"',
        'picture.size AS "size"',
        'picture.link AS "link"',
        'picture.url AS "url"',
        'picture.header AS "header"',
        'picture.height AS "height"',
        'picture.smallName AS "smallName"',
        'picture.smallAlt AS "smallAlt"',
        'picture.smallTitle AS "smallTitle"',
        'picture.smallWidth AS "smallWidth"',
        'picture.smallHeight AS "smallHeight"',
        'picture.createdDate AS "createdDate"',
        'picture.mimeId AS "mimeId"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(download.id)')
          .from(Download, 'download')
          .where('download.pictureId = picture.id');
      }, 'downloads')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(view.id)')
          .from(View, 'view')
          .where('view.pictureId = picture.id');
      }, 'views')
      .where('picture.active = :active', { active: true })
      .groupBy('picture.id');

    if (params.sort === SortEnum.downloads) {
      query = query.orderBy('picture.downloads', direction);
    } else if (params.sort === SortEnum.views) {
      query = query.orderBy('picture.views', direction);
    } else {
      query = query.orderBy('picture.createdDate', direction);
    }

    if (params.search) {
      query = query.andWhere(
        'to_tsvector(picture.title) || to_tsvector(picture.description) || to_tsvector(picture.header) || to_tsvector(picture.content) || to_tsvector(picture.tinyAlt) || to_tsvector(picture.tinyTitle) || to_tsvector(picture.smallAlt) || to_tsvector(picture.smallTitle) || to_tsvector(picture.bigAlt) || to_tsvector(picture.bigTitle) @@ plainto_tsquery(:search)',
        { search: params.search },
      );
    }

    if (params.fromWidth) {
      query = query.andWhere('width >= :fw', { fw: params.fromWidth });
    }

    if (params.fromHeight) {
      query = query.andWhere('height >= :fh', { fh: params.fromHeight });
    }

    if (params.toWidth) {
      query = query.andWhere('width <= :tw', { tw: params.toWidth });
    }

    if (params.toHeight) {
      query = query.andWhere('height <= :th', { th: params.toHeight });
    }

    if (params.tags) {
      query = query.andWhere('tag.id IN (:...tags)', { tags: params.tags });
    }

    const count = await query.getCount();
    const recs: ItemsDto[] = await query
      .offset(params.offset)
      .limit(params.limit)
      .execute();

    return { count, recs };
  }

  async getSitemapItems(): Promise<SitemapDto[]> {
    const recs: SitemapDto[] = await this.createQueryBuilder('picture')
      .select([
        'picture.id AS "id"',
        'picture.url AS "url"',
        'picture.bigName AS "name"',
        'picture.title AS "title"',
        'picture.bigAlt AS "alt"',
        'picture.updatedDate AS "updated"',
      ])
      .where('picture.active = :active', { active: true })
      .orderBy('picture.id', 'DESC')
      .limit(50000)
      .execute();

    return recs;
  }
}
