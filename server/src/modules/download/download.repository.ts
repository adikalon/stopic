import { EntityRepository, Repository } from 'typeorm';
import { Download } from './download.entity';

@EntityRepository(Download)
export class DownloadRepository extends Repository<Download> {}
