import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YandexDiskService } from '../../common/services/yandex-disk.service';
import { PictureController } from './picture.controller';
import { PictureRepository } from './picture.repository';
import { PictureService } from './picture.service';

@Module({
  imports: [TypeOrmModule.forFeature([PictureRepository]), HttpModule],
  controllers: [PictureController],
  providers: [PictureService, YandexDiskService],
})
export class PictureModule {}
