import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
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
import { DownloadRepository } from './download.repository';
import { VisitorRequest } from '../visitor/visitor-request.interface';

@Controller('download')
export class DownloadController {
  constructor(
    @InjectRepository(DownloadRepository)
    private readonly downloadRepository: DownloadRepository,
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    private readonly downloadService: DownloadService,
    private readonly yandexDiskService: YandexDiskService,
    private readonly mimeService: MimeService,
  ) {}

  @Get('/:token')
  @RequestTimeout(30000)
  async download(
    @Req() req: VisitorRequest,
    @Res({ passthrough: true }) res: Response,
    @Param('token') token: string,
  ): Promise<StreamableFile> {
    const picture = await this.pictureRepository.getByToken(token);

    if (!picture) {
      throw new NotFoundException('Non-existent token');
    }

    const ext = await this.mimeService.getExtByMime(picture.mime);
    const imageName = `${token}.${ext}`;
    const imagePath = path.join(__dirname, `/../../../temp/${imageName}`);
    const diskPath = `${picture.subFolder}/${picture.id}.zip`;
    const arcPath = path.join(__dirname, `/../../../temp/${token}.zip`);
    await this.yandexDiskService.download(diskPath, arcPath);
    await this.downloadService.extract(arcPath, imagePath);
    res.set('Content-Type', picture.mime);
    res.set('Content-Disposition', `attachment; filename=${picture.id}.${ext}`);
    const imageContent = await fsPromises.readFile(imagePath);
    await fsPromises.unlink(arcPath);
    await fsPromises.unlink(imagePath);
    await this.downloadRepository.increase(req.visitor.id, picture.id);

    return new StreamableFile(imageContent);
  }
}
