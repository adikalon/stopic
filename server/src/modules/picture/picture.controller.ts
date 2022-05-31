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
import { RequestTimeout } from '../../common/interceptors/timeout.interceptor';
import { Connection } from 'typeorm';
import { PictureRepository } from './picture.repository';
import { MimeRepository } from '../mime/mime.repository';
import { MimeTypeEnum } from '../mime/mime-type.enum';

@Controller('picture')
export class PictureController {
  constructor(private readonly connection: Connection) {}

  @Post('/')
  @RequestTimeout(30000)
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './temp',
      preservePath: true,
      fileFilter: uploadFilter,
      limits: { fileSize: 10485760 },
    }),
  )
  async upload(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    await this.connection.transaction(async (manager) => {
      const mimeRepository = manager.getCustomRepository(MimeRepository);
      const pictureRepository = manager.getCustomRepository(PictureRepository);
      const mimeType = image.mimetype as MimeTypeEnum;
      const mime = await mimeRepository.getMimeByString(mimeType);

      const result = await pictureRepository.createAndGetResult({
        active: false,
        width: 1,
        height: 1,
        size: 1,
        hash: Date.now().toString(),
        url: 'a',
        subFolder: 'a',
        header: body.header,
        altFull: body.altFull,
        altPreview: body.altPreview,
        nameFull: body.nameFull,
        namePreview: body.namePreview,
        titleMeta: body.titleMeta,
        titleAttribute: body.titleAttribute,
        descriptionPage: body.descriptionPage,
        descriptionMeta: body.descriptionMeta,
        mime: mime,
      });

      const recordId = +result.raw[0].id;

      console.log(recordId);
    });

    return body;
  }
}
