import { Module } from '@nestjs/common';
import { PictureModule } from '../picture/picture.module';
import { IndexController } from './index.controller';

@Module({
  controllers: [IndexController],
  imports: [PictureModule],
})
export class IndexModule {}
