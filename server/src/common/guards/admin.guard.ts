import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../env.validation';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const authToken = req.header('authorization');
    const adminToken = `Bearer ${this.configService.get('ADMIN_TOKEN')}`;

    if (!authToken || authToken !== adminToken) {
      res.set({ 'WWW-Authenticate': 'Bearer realm="Space (ADMIN_TOKEN)' });
      throw new UnauthorizedException();
    }

    return true;
  }
}
