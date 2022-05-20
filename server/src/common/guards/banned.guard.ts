import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BannedService } from '../../modules/banned/banned.service';
import { VisitorRequest } from '../../modules/visitor/visitor-request.interface';

@Injectable()
export class BannedGuard implements CanActivate {
  constructor(private readonly bannedService: BannedService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: VisitorRequest = context.switchToHttp().getRequest();
    const banned = await this.bannedService.getVisitorBanned(req.visitor);

    if (banned) {
      throw new ForbiddenException(`Access blocked to ${banned.bannedTo}`);
    }

    return true;
  }
}
