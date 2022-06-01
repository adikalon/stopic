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
import { PictureService } from './picture.service';
import * as path from 'path';
import * as moment from 'moment';
import ShortUniqueId from 'short-unique-id';

@Controller('picture')
export class PictureController {
  constructor(
    private readonly connection: Connection,
    private readonly pictureService: PictureService,
  ) {}

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
      const imagePath = path.join(__dirname, '/../../../', image.path);
      const metadata = await this.pictureService.getMetadata(imagePath);
      const subFolder = moment().format('YYYY-MM-DD');
      const uid = new ShortUniqueId({
        length: 50,
        dictionary: 'alphanum_lower',
      });
      const hash: string = uid();

      const result = await pictureRepository.createAndGetResult({
        active: false,
        width: metadata.width,
        height: metadata.height,
        size: image.size,
        hash: hash,
        url: body.url,
        subFolder: subFolder,
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

      const pictureId = +result.raw[0].id;
      const archivePath = await this.pictureService.archivate({
        imagePath: imagePath,
        mimeType: mimeType,
        pictureId: pictureId,
      });

      console.log(archivePath);
    });

    return body;
  }
}
