import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

@Injectable()
export class AppService {
  @Cron('0 0 0 * * *')
  async clearTemp() {
    const pathFolder = path.join(__dirname, '/../temp/');

    (await fsPromises.readdir(pathFolder)).forEach(async (file) => {
      const pathFile = path.join(pathFolder, file);
      const stats = await fsPromises.stat(pathFile);
      const diff = Math.abs(new Date().getTime() - stats.mtime.getTime());

      if (stats.isFile() && diff > 3600000) {
        await fsPromises.unlink(pathFile);
      }
    });
  }
}
