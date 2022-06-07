import { EntityRepository, Repository } from 'typeorm';
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

  async del(id: number): Promise<void> {
    await this.createQueryBuilder().softDelete().where({ id }).execute();
  }
}
