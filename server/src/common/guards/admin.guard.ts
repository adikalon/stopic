import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../env.validation';

@Injectable()
export class AdminGuard implements CanActivate {
  private static date = new Date();

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const date = new Date();

    if (AdminGuard.date > date) {
      throw new ForbiddenException(`Forbidden to ${AdminGuard.date}`);
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const authToken = req.header('authorization');
    const adminToken = `Bearer ${this.configService.get('ADMIN_TOKEN')}`;

    if (!authToken || authToken !== adminToken) {
      AdminGuard.date = new Date(new Date().getTime() + 5 * 60000);
      res.set({ 'WWW-Authenticate': 'Bearer realm="Space (ADMIN_TOKEN)' });
      throw new UnauthorizedException();
    }

    return true;
  }
}
