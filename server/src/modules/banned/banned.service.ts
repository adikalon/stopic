import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from '../visitor/visitor.entity';
import { Banned } from './banned.entity';
import { BannedRepository } from './banned.repository';

@Injectable()
export class BannedService {
  constructor(
    @InjectRepository(BannedRepository)
    private readonly bannedRepository: BannedRepository,
  ) {}

  async getVisitorBanned(visitor: Visitor): Promise<Banned | undefined> {
    return await this.bannedRepository.getBanned(visitor);
  }
}
