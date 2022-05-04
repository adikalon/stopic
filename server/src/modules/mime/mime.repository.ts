import { EntityRepository, Repository } from 'typeorm';
import { Mime } from './mime.entity';

@EntityRepository(Mime)
export class MimeRepository extends Repository<Mime> {}
