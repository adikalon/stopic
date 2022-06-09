import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YandexDiskService } from '../../common/services/yandex-disk.service';
import { MimeModule } from '../mime/mime.module';
import { PictureRepository } from '../picture/picture.repository';
import { DownloadController } from './download.controller';
import { DownloadRepository } from './download.repository';
import { DownloadService } from './download.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DownloadRepository, PictureRepository]),
    HttpModule,
    MimeModule,
  ],
  controllers: [DownloadController],
  providers: [DownloadService, YandexDiskService],
  exports: [TypeOrmModule],
})
export class DownloadModule {}
