import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureController } from './picture.controller';
import { PictureRepository } from './picture.repository';
import { PictureService } from './picture.service';

@Module({
  imports: [TypeOrmModule.forFeature([PictureRepository])],
  controllers: [PictureController],
  providers: [PictureService],
})
export class PictureModule {}
