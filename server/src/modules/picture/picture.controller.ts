import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Express, Response } from 'express';
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
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../env.validation';
import { InjectRepository } from '@nestjs/typeorm';
import { EditDto } from './dto/edit.dto';

@Controller('picture')
export class PictureController {
  private readonly logger = new Logger(PictureController.name);

  constructor(
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    @InjectRepository(TagRepository)
    private readonly tagRepository: TagRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
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
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UploadDto,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const pictureRepository = manager.getCustomRepository(PictureRepository);
      const mimeRepository = manager.getCustomRepository(MimeRepository);
      const tagRepository = manager.getCustomRepository(TagRepository);
      const mimeType = image.mimetype as MimeTypeEnum;
      const mimeId = await mimeRepository.getMimeIdByString(mimeType);
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
      const ccLink = await this.catCutService.shorten(
        `${this.configService.get('APP_URL')}/api/download/${token}`,
        `| ${this.configService.get('APP_NAME')} | ${
          body.url
        } | ${mimeType} | ${metadata.width}x${metadata.height} | ${
          image.size
        } |`,
      );
      this.logger.log(`CatCut link created: ${ccLink}`);

      const pictureId = await pictureRepository.createAndGetId({
        width: metadata.width,
        height: metadata.height,
        size: image.size,
        link: ccLink,
        token: token,
        url: body.url,
        title: body.title,
        description: body.description,
        header: body.header,
        content: body.content,
        subFolder: subFolder,
        tinyName: body.tinyName,
        tinyAlt: body.tinyAlt,
        tinyTitle: body.tinyTitle,
        tinyWidth: ptpMetadata.width,
        tinyHeight: ptpMetadata.height,
        smallName: body.smallName,
        smallAlt: body.smallAlt,
        smallTitle: body.smallTitle,
        smallWidth: pspMetadata.width,
        smallHeight: pspMetadata.height,
        bigName: body.bigName,
        bigAlt: body.bigAlt,
        bigTitle: body.bigTitle,
        bigWidth: pbpMetadata.width,
        bigHeight: pbpMetadata.height,
        mimeId: mimeId,
        active: body.active,
      });

      const archivePath = await this.pictureService.archivate({
        imagePath: imagePath,
        mimeType: mimeType,
        pictureId: pictureId,
      });

      const tags = await tagRepository.getCreateTags(body.tags);
      await pictureRepository.attachTags(pictureId, tags);
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

      res.set(
        'Location',
        `${this.configService.get('APP_URL')}/api/picture/${pictureId}`,
      );
    });
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async edit(@Param('id') id: number, @Body() body: EditDto) {
    const picture = await this.pictureRepository.getById(id);

    if (!picture) {
      throw new NotFoundException('Image not found');
    }

    await this.pictureRepository.edit(picture.id, {
      link: body?.link,
      token: body?.token,
      url: body?.url,
      title: body?.title,
      description: body?.description,
      header: body?.header,
      content: body?.content,
      subFolder: body?.subFolder,
      tinyName: body?.tinyName,
      tinyAlt: body?.tinyAlt,
      tinyTitle: body?.tinyTitle,
      smallName: body?.smallName,
      smallAlt: body?.smallAlt,
      smallTitle: body?.smallTitle,
      bigName: body?.bigName,
      bigAlt: body?.bigAlt,
      bigTitle: body?.bigTitle,
      active: body?.active,
    });

    if (body.tags) {
      const tags = await this.tagRepository.getCreateTags(body.tags);
      await this.pictureRepository.attachTags(
        picture.id,
        tags,
        picture.tags.map((tag) => tag.id),
      );
    }

    return body;
  }

  @Get('/:id/preview/:image')
  async preview(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: number,
    @Param('image') image: string,
  ): Promise<StreamableFile> {
    const picture = await this.pictureRepository.getById(id);

    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    const fileName = image.replace(/\.webp$/, '');
    let file: string;

    if (fileName === picture.tinyName) {
      file = 'tiny.webp';
    } else if (fileName === picture.smallName) {
      file = 'small.webp';
    } else if (fileName === picture.bigName) {
      file = 'big.webp';
    } else {
      throw new NotFoundException('Image not found');
    }

    const imagePath = path.join(
      __dirname,
      '/../../../storage/',
      picture.subFolder,
      picture.id.toString(),
      file,
    );

    res.set('Content-Type', 'image/webp');
    const imageContent = await fsPromises.readFile(imagePath);

    return new StreamableFile(imageContent);
  }
}
