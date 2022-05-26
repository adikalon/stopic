import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Express } from 'express';
import { uploadFilter } from './upload-filter';
import { UploadDto } from './dto/upload.dto';

@Controller('picture')
export class PictureController {
  @Post('/')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './temp/upload',
      preservePath: true,
      fileFilter: uploadFilter,
      limits: { fileSize: 10485760 },
    }),
  )
  async upload(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    console.log(image);

    return body;
  }
}
