import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureRepository } from './picture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PictureRepository])],
})
export class PictureModule {}
