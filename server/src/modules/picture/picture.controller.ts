import {
  Body,
  Controller,
  Logger,
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
import { YandexDiskService } from '../../common/services/yandex-disk.service';
import { CatCutService } from '../../common/services/cat-cut.service';

@Controller('picture')
export class PictureController {
  private readonly logger = new Logger(PictureController.name);

  constructor(
    private readonly connection: Connection,
    private readonly pictureService: PictureService,
    private readonly yandexDiskService: YandexDiskService,
    private readonly catCutService: CatCutService,
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
      const mimeType = image.mimetype as MimeTypeEnum;
      const mime = await mimeRepository.getMimeByString(mimeType);
      const imagePath = path.join(__dirname, '/../../../', image.path);
      const metadata = await this.pictureService.getMetadata(imagePath);
      const subFolder = moment().format('YYYY-MM-DD');
      const uid = new ShortUniqueId({
        length: 50,
        dictionary: 'alphanum_lower',
      });
      const token: string = uid();

      const ptp = await this.pictureService.makePreview(imagePath, 150, false);
      const psp = await this.pictureService.makePreview(imagePath, 300, false);
      const pbp = await this.pictureService.makePreview(imagePath, 800, true);
      const ptpMetadata = await this.pictureService.getMetadata(ptp);
      const pspMetadata = await this.pictureService.getMetadata(psp);
      const pbpMetadata = await this.pictureService.getMetadata(pbp);
      const ccLink = await this.catCutService.shorten('http://d.loc', 'stopic'); // TODO: Create real download link
      this.logger.log(`CatCut link created: ${ccLink}`);

      const result = await pictureRepository.createAndGetResult({
        active: body.active,
        width: metadata.width,
        height: metadata.height,
        size: image.size,
        link: ccLink,
        token: token,
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
        widthPreviewTiny: ptpMetadata.width,
        heightPreviewTiny: ptpMetadata.height,
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

      try {
        await fsPromises.copyFile(ptp, `${storagePath}/tiny.webp`);
        await fsPromises.copyFile(psp, `${storagePath}/small.webp`);
        await fsPromises.copyFile(pbp, `${storagePath}/big.webp`);
        await this.yandexDiskService.upload(subFolder, archivePath);
      } catch (err) {
        try {
          await fsPromises.rm(storagePath, { recursive: true });
        } catch (e) {
          this.logger.error(`Delete folder failed: ${storagePath}`);
        }

        throw err;
      }

      await fsPromises.unlink(imagePath);
      await fsPromises.unlink(ptp);
      await fsPromises.unlink(psp);
      await fsPromises.unlink(pbp);
      await fsPromises.unlink(archivePath);
    });

    return body;
  }
}
