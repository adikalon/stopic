import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class AppController {
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  async robots(@Res() res: Response): Promise<void> {
    const robots = path.join(__dirname, '/../robots.txt');
    res.sendFile(robots);
  }
}
