import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  robots(): string {
    return 'User-agent: *';
  }
}
