import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, NextFunction } from 'express';
import { VisitorRequest } from '../../modules/visitor/visitor-request.interface';
import { VisitorRepository } from '../../modules/visitor/visitor.repository';

@Injectable()
export class RegisterVisitorMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(VisitorRepository)
    private readonly visitorRepository: VisitorRepository,
  ) {}

  async use(req: VisitorRequest, _res: Response, next: NextFunction) {
    console.log(req);
    console.log(req.clientIp);
    console.log(req.clientIp);
    const ip = req.clientIp;
    const ua = req.header('user-agent');

    if (!ip) {
      throw new UnauthorizedException('Client IP not found');
    }

    if (!ua) {
      throw new UnauthorizedException('User-Agent not found');
    }

    let visitor = await this.visitorRepository.getByIpAndUserAgent(ip, ua);

    if (visitor) {
      await this.visitorRepository.touchById(visitor.id);
    } else {
      visitor = await this.visitorRepository.registerAndGet(ip, ua);
    }

    req.visitor = visitor;

    next();
  }
}
