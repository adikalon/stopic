import { EntityRepository, Repository } from 'typeorm';
import { Banned } from './banned.entity';

@EntityRepository(Banned)
export class BannedRepository extends Repository<Banned> {}
