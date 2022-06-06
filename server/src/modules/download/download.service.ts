import { Injectable } from '@nestjs/common';
import * as JSZip from 'jszip';
import * as fsPromises from 'fs/promises';

@Injectable()
export class DownloadService {
  async extract(archivePath: string, imagePath: string): Promise<void> {
    const archiveData = await fsPromises.readFile(archivePath);
    const archiveContent = await JSZip.loadAsync(archiveData);
    const fileName = Object.keys(archiveContent.files)[0];

    if (!fileName) {
      throw new Error('No files in archive');
    }

    const content = await archiveContent.files[fileName]?.async('nodebuffer');

    if (!content) {
      throw new Error('Failed to get file content');
    }

    await fsPromises.writeFile(imagePath, content);
  }
}
