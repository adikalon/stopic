import { EntityRepository, Repository } from 'typeorm';
import { Trash } from './trash.entity';

@EntityRepository(Trash)
export class TrashRepository extends Repository<Trash> {}
