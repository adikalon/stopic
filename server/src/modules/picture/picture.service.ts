import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PictureService {
  private readonly logger = new Logger(PictureService.name);

  @Cron('0 0 0 * * *')
  async cleanUpload() {
    const pathFolder = path.join(__dirname, '/../../../temp/upload/');

    fs.access(pathFolder, (err) => {
      if (err) {
        return;
      }

      fs.readdir(pathFolder, (err, files) => {
        if (err) {
          this.logger.warn(err.message);
          return;
        }

        files.forEach((file) => {
          const pathFile = path.join(pathFolder, file);

          fs.stat(pathFile, (err, stats) => {
            if (err) {
              this.logger.warn(err.message);
              return;
            }

            const diff = Math.abs(new Date().getTime() - stats.mtime.getTime());

            if (diff > 3600000) {
              fs.unlink(pathFile, (err) => {
                if (err) {
                  this.logger.warn(err.message);
                  return;
                }
              });
            }
          });
        });
      });
    });
  }
}
