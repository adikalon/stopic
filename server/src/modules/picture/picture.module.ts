import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatCutService } from '../../common/services/cat-cut.service';
import { YandexDiskService } from '../../common/services/yandex-disk.service';
import { MimeModule } from '../mime/mime.module';
import { TagModule } from '../tag/tag.module';
import { PictureController } from './picture.controller';
import { PictureRepository } from './picture.repository';
import { PictureService } from './picture.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureRepository]),
    HttpModule,
    MimeModule,
    TagModule,
  ],
  controllers: [PictureController],
  providers: [PictureService, YandexDiskService, CatCutService],
})
export class PictureModule {}
