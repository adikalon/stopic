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
import { TagRepository } from '../tag/tag.repository';
import * as fsPromises from 'fs/promises';
import { TrashRepository } from '../trash/trash.repository';
import { TrashTypeEnum } from '../trash/trash-type.enum';

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
      const pictureRepository = manager.getCustomRepository(PictureRepository);
      const mimeRepository = manager.getCustomRepository(MimeRepository);
      const tagRepository = manager.getCustomRepository(TagRepository);
      const trashRepository = manager.getCustomRepository(TrashRepository);
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

      const psp = await this.pictureService.makePreview(imagePath, 300, false);
      const pbp = await this.pictureService.makePreview(imagePath, 800, true);
      const pspMetadata = await this.pictureService.getMetadata(psp);
      const pbpMetadata = await this.pictureService.getMetadata(pbp);

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
        widthPreviewSmall: pspMetadata.width,
        heightPreviewSmall: pspMetadata.height,
        widthPreviewBig: pbpMetadata.width,
        heightPreviewBig: pbpMetadata.height,
        mime: mime,
      });

      const pictureId = +result.raw[0].id;
      const archivePath = await this.pictureService.archivate({
        imagePath: imagePath,
        mimeType: mimeType,
        pictureId: pictureId,
      });

      const tags = await tagRepository.getCreateTags(body.tags);
      await pictureRepository.attachTags(tags, pictureId);
      const storagePath = path.join(
        __dirname,
        '/../../../storage/',
        subFolder,
        pictureId.toString(),
      );

      await fsPromises.mkdir(storagePath, { recursive: true });
      await fsPromises.copyFile(psp, `${storagePath}/small.webp`);

      try {
        await fsPromises.copyFile(pbp, `${storagePath}/big.webp`);
      } catch (err) {
        await trashRepository.inTrash(TrashTypeEnum.Storage, storagePath);
        throw err;
      }

      console.log(archivePath);
    });

    return body;
  }
}
