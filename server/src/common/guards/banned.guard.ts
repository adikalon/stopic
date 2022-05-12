import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BannedService } from '../../modules/banned/banned.service';
import { VisitorService } from '../../modules/visitor/visitor.service';

@Injectable()
export class BannedGuard implements CanActivate {
  constructor(
    private readonly visitorService: VisitorService,
    private readonly bannedService: BannedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.clientIp;
    const userAgent = req.header('user-agent');

    if (ip && userAgent) {
      const visitor = await this.visitorService.getVisitor(ip, userAgent);

      if (visitor) {
        const banned = await this.bannedService.getVisitorBanned(visitor);

        if (banned) {
          throw new HttpException(
            `Access blocked to ${banned.bannedTo}`,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    return true;
  }
}
