import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, UpdateResult } from 'typeorm';
import { VisitorRepository } from './visitor.repository';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorRepository)
    private visitorRepository: VisitorRepository,
  ) {}

  async getVisitor(ip: string, userAgent: string) {
    return await this.visitorRepository.getByIpAndUserAgent(ip, userAgent);
  }

  async registerVisitor(ip: string, userAgent: string): Promise<InsertResult> {
    return await this.visitorRepository.register(ip, userAgent);
  }

  async touchVisitor(id: number): Promise<UpdateResult> {
    return await this.visitorRepository.touchById(id);
  }
}
