import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckHeadersMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (!req.clientIp) {
      throw new HttpException(
        'Client IP not found',
        HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
      );
    }

    if (!req.header('user-agent')) {
      throw new HttpException(
        'User-Agent not found',
        HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
      );
    }

    next();
  }
}
