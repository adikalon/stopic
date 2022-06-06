import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestTimeout } from '../../common/interceptors/timeout.interceptor';
import { DownloadService } from './download.service';
import { YandexDiskService } from '../../common/services/yandex-disk.service';
import { PictureRepository } from '../picture/picture.repository';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { MimeService } from '../mime/mime.service';
import { Response } from 'express';

@Controller('download')
export class DownloadController {
  constructor(
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    private readonly downloadService: DownloadService,
    private readonly yandexDiskService: YandexDiskService,
    private readonly mimeService: MimeService,
  ) {}

  @Get('/:token')
  @RequestTimeout(15000)
  async download(
    @Res({ passthrough: true }) res: Response,
    @Param('token') token: string,
  ): Promise<StreamableFile> {
    const picture = await this.pictureRepository.getByToken(token);

    if (!picture) {
      throw new NotFoundException('Non-existent token');
    }

    const ext = await this.mimeService.getExtByMime(picture.mime.type);
    const imageName = `${picture.token}.${ext}`;
    const imagePath = path.join(__dirname, `/../../../temp/${imageName}`);
    const diskPath = `${picture.subFolder}/${picture.id}.zip`;
    const arcPath = path.join(__dirname, `/../../../temp/${picture.token}.zip`);
    await this.yandexDiskService.download(diskPath, arcPath);
    await this.downloadService.extract(arcPath, imagePath);
    res.set('Content-Type', picture.mime.type);
    res.set('Content-Disposition', `attachment; filename=${picture.id}.${ext}`);
    const imageContent = await fsPromises.readFile(imagePath);
    await fsPromises.unlink(arcPath);
    await fsPromises.unlink(imagePath);

    return new StreamableFile(imageContent);
  }
}
