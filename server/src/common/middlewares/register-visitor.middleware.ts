import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { VisitorRequest } from '../../modules/visitor/visitor-request.interface';
import { VisitorService } from '../../modules/visitor/visitor.service';

@Injectable()
export class RegisterVisitorMiddleware implements NestMiddleware {
  constructor(private readonly visitorService: VisitorService) {}

  async use(req: VisitorRequest, _res: Response, next: NextFunction) {
    const ip = req.clientIp;
    const userAgent = req.header('user-agent');

    if (!ip) {
      throw new UnauthorizedException('Client IP not found');
    }

    if (!userAgent) {
      throw new UnauthorizedException('User-Agent not found');
    }

    let visitor = await this.visitorService.getVisitor(ip, userAgent);

    if (visitor) {
      await this.visitorService.touchVisitor(visitor.id);
    } else {
      await this.visitorService.registerVisitor(ip, userAgent);
      visitor = await this.visitorService.getVisitor(ip, userAgent);

      if (!visitor) {
        throw new InternalServerErrorException('Visitor is not in the DB');
      }
    }

    req.visitor = visitor;

    next();
  }
}
