import { EntityRepository, Repository } from 'typeorm';
import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getCreateTags(tags: string[]): Promise<Tag[]> {
    const prepTags: Tag[] = [];

    for (const tag of tags) {
      let tagEntity = await this.createQueryBuilder('tag')
        .where('tag.name = :name', { name: tag })
        .getOne();

      if (tagEntity) {
        await this.createQueryBuilder()
          .update()
          .set({ updatedDate: () => 'NOW()' })
          .where('id = :id', { id: tagEntity.id })
          .execute();
      } else {
        await this.createQueryBuilder()
          .insert()
          .values({ name: tag })
          .execute();

        tagEntity = await this.createQueryBuilder('tag')
          .where('tag.name = :name', { name: tag })
          .getOne();

        if (!tagEntity) {
          throw new Error('Tag not found');
        }
      }

      prepTags.push(tagEntity);
    }

    return prepTags;
  }
}
