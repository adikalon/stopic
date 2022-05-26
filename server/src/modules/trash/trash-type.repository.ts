import { EntityRepository, Repository } from 'typeorm';
import { TrashType } from './trash-type.entity';

@EntityRepository(TrashType)
export class TrashTypeRepository extends Repository<TrashType> {}
