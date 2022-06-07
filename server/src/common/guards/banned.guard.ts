import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedRepository } from '../../modules/banned/banned.repository';
import { VisitorRequest } from '../../modules/visitor/visitor-request.interface';

@Injectable()
export class BannedGuard implements CanActivate {
  constructor(
    @InjectRepository(BannedRepository)
    private readonly bannedRepository: BannedRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: VisitorRequest = context.switchToHttp().getRequest();
    const bannedTo = await this.bannedRepository.getBannedTo(req.visitor.id);

    if (bannedTo) {
      throw new ForbiddenException(`Access blocked to ${bannedTo}`);
    }

    return true;
  }
}
