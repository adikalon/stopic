import { EntityRepository, Repository } from 'typeorm';
import { TagDataPopularDto } from './dto/tag-data-popular.dto';
import { TagDataDto } from './dto/tag-data.dto';
import { PaginatedInterface } from './paginated.interface';
import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getCreateTags(tags: string[]): Promise<number[]> {
    const prepTags: number[] = [];

    for (const tag of tags) {
      const entity = await this.createQueryBuilder('tag')
        .where('tag.name = :name', { name: tag })
        .withDeleted()
        .getOne();

      if (entity) {
        prepTags.push(entity.id);

        await this.createQueryBuilder()
          .update()
          .set({ updatedDate: () => 'NOW()' })
          .where('id = :id', { id: entity.id })
          .execute();
      } else {
        const result = await this.createQueryBuilder()
          .insert()
          .values({ name: tag })
          .returning(['id'])
          .execute();

        const { id } = result.generatedMaps[0] as { id: string };
        prepTags.push(+id);
      }
    }

    return prepTags;
  }

  async hide(id: number): Promise<void> {
    await this.createQueryBuilder().softDelete().where({ id }).execute();
  }

  async show(id: number): Promise<void> {
    await this.createQueryBuilder().restore().where({ id }).execute();
  }

  async getPopular(limit: number): Promise<TagDataPopularDto[]> {
    const result = (await this.createQueryBuilder('tag')
      .leftJoinAndSelect('tag.pictures', 'pictures')
      .groupBy('tag.id')
      .select(['tag.id AS id', 'tag.name AS name', 'COUNT(tag.id) as count'])
      .orderBy('count', 'DESC')
      .addOrderBy('tag.updatedDate', 'DESC')
      .limit(limit)
      .execute()) as { id: string; name: string; count: string }[];

    return result.map((r) => ({ id: +r.id, name: r.name, count: +r.count }));
  }

  async getPaginated(data: PaginatedInterface): Promise<TagDataDto[]> {
    let query = this.createQueryBuilder('tag')
      .offset(data.offset)
      .limit(data.limit)
      .orderBy('tag.name', 'ASC');

    if (data.deleted) {
      query = query.withDeleted().andWhere('tag.deletedDate IS NOT NULL');
    }

    if (data.search) {
      query = query.andWhere('tag.name LIKE :n', { n: `%${data.search}%` });
    }

    const result = await query.getMany();

    return result.map((r) => ({ id: r.id, name: r.name }));
  }

  async getCount(deleted?: boolean): Promise<number> {
    if (deleted) {
      return await this.createQueryBuilder('tag')
        .withDeleted()
        .where('tag.deletedDate IS NOT NULL')
        .getCount();
    }

    return await this.createQueryBuilder('tag').getCount();
  }
}
