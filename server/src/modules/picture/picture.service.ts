import { Injectable } from '@nestjs/common';
import { MetadataInterface } from './interfaces/metadata.inteface';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class PictureService {
  async getMetadata(imagePath: string): Promise<MetadataInterface> {
    const metadata = await sharp(imagePath).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Missing width and/or height');
    }

    const size: number = await new Promise((res, rej) => {
      fs.stat(imagePath, (err, stats) => {
        if (err) {
          rej(err);
        }

        res(stats.size);
      });
    });

    return {
      width: metadata.width,
      height: metadata.height,
      size: size,
    };
  }
}
