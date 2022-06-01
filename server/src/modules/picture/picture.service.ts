import { Injectable } from '@nestjs/common';
import { MetadataInterface } from './interfaces/metadata.inteface';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';
import { ArchivateInterface } from './interfaces/archivate.interface';

@Injectable()
export class PictureService {
  async getMetadata(imagePath: string): Promise<MetadataInterface> {
    const metadata = await sharp(imagePath).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Missing width and/or height');
    }

    return {
      width: metadata.width,
      height: metadata.height,
    };
  }

  async archivate(data: ArchivateInterface): Promise<string> {
    const ext = data.mimeType.replace(/^.+\//, '');
    const archivePath = path.join(
      __dirname,
      '/../../../temp/',
      `${data.pictureId}.zip`,
    );

    await new Promise((resolve, reject) => {
      fs.readFile(data.imagePath, (err, content) => {
        if (err) {
          reject(err);
        }

        const zip = new JSZip();

        zip.file(`${data.pictureId}.${ext}`, content);

        zip
          .generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true,
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
          })
          .pipe(fs.createWriteStream(archivePath))
          .on('error', reject)
          .on('finish', resolve);
      });
    });

    return archivePath;
  }
}
