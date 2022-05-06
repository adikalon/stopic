import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VisitorService } from '../../modules/visitor/visitor.service';

@Injectable()
export class RegisterVisitorMiddleware implements NestMiddleware {
  constructor(private readonly visitorService: VisitorService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.clientIp;
    const userAgent = req.header('user-agent');

    if (ip && userAgent) {
      const visitor = await this.visitorService.getVisitor(ip, userAgent);

      if (visitor) {
        await this.visitorService.touchVisitor(visitor.id);
      } else {
        await this.visitorService.registerVisitor(ip, userAgent);
      }
    }

    next();
  }
}
