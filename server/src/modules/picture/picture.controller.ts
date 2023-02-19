import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { PictureDataBigDto } from './dto/picture-data-big';
import { ViewRepository } from '../view/view.repository';
import { DownloadRepository } from '../download/download.repository';
import { VisitorRequest } from '../visitor/visitor-request.interface';
import { PictureDataTinyDto } from './dto/picture-data-tiny.dto';
import { ItemsQueryDto } from './dto/items-query.dto';
import { SortEnum } from './sort.enum';
import { PictureDataSmallDto } from './dto/picture-data-small.dto';

@Controller('picture')
export class PictureController {
  private readonly logger = new Logger(PictureController.name);

  constructor(
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
    @InjectRepository(ViewRepository)
    private readonly viewRepository: ViewRepository,
    @InjectRepository(DownloadRepository)
    private readonly downloadRepository: DownloadRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly connection: Connection,
    private readonly pictureService: PictureService,
    private readonly yandexDiskService: YandexDiskService,
    private readonly catCutService: CatCutService,
  ) {}

  @Post('/')
  @RequestTimeout(300000)
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
      const ptp = await this.pictureService.makePreview(
        imagePath,
        150,
        false,
        'cover',
      );
      const psp = await this.pictureService.makePreview(
        imagePath,
        320,
        false,
        'cover',
      );
      const pbp = await this.pictureService.makePreview(
        imagePath,
        800,
        true,
        'inside',
      );
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
  async edit(
    @Param('id') id: number,
    @Body() body: EditDto,
  ): Promise<PictureDataBigDto> {
    await this.connection.transaction(async (manager) => {
      const pictureRepository = manager.getCustomRepository(PictureRepository);
      const tagRepository = manager.getCustomRepository(TagRepository);
      const picture = await pictureRepository.getById(id, true);

      if (!picture) {
        throw new NotFoundException('Image not found');
      }

      await pictureRepository.edit(picture.id, {
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
        const tags = await tagRepository.getCreateTags(body.tags);
        await pictureRepository.attachTags(
          picture.id,
          tags,
          picture.tags.map((tag) => tag.id),
        );
      }
    });

    const picture = await this.pictureRepository.getById(id);

    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    return {
      id: picture.id,
      width: picture.width,
      height: picture.height,
      size: picture.size,
      link: picture.link,
      url: picture.url,
      title: picture.title,
      description: picture.description,
      header: picture.header,
      content: picture.content,
      previewName: picture.bigName,
      previewAlt: picture.bigAlt,
      previewTitle: picture.bigTitle,
      previewWidth: picture.bigWidth,
      previewHeight: picture.bigHeight,
      mime: picture.mime,
      created: picture.createdDate,
      views: await this.viewRepository.getCount(picture.id),
      downloads: await this.downloadRepository.getCount(picture.id),
      tags: picture.tags,
    };
  }

  @Get('/:id')
  async item(
    @Req() req: VisitorRequest,
    @Param('id') id: number,
  ): Promise<PictureDataBigDto> {
    const picture = await this.pictureRepository.getById(id);

    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    await this.viewRepository.increase(req.visitor.id, picture.id);

    return {
      id: picture.id,
      width: picture.width,
      height: picture.height,
      size: picture.size,
      link: picture.link,
      title: picture.title,
      url: picture.url,
      description: picture.description,
      header: picture.header,
      content: picture.content,
      previewName: picture.bigName,
      previewAlt: picture.bigAlt,
      previewTitle: picture.bigTitle,
      previewWidth: picture.bigWidth,
      previewHeight: picture.bigHeight,
      mime: picture.mime,
      created: picture.createdDate,
      views: await this.viewRepository.getCount(picture.id),
      downloads: await this.downloadRepository.getCount(picture.id),
      tags: picture.tags,
    };
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

  @Get('/recommended/:id')
  async recommended(@Param('id') id: number): Promise<PictureDataTinyDto[]> {
    const recommendeds: PictureDataTinyDto[] = [];
    const recs = await this.pictureRepository.getRecommended(id, 10);

    for (const rec of recs) {
      const picture = await this.pictureRepository.getById(+rec.id);

      if (!picture) {
        throw new InternalServerErrorException('Picture not found');
      }

      recommendeds.push({
        id: +rec.id,
        width: rec.width,
        height: rec.height,
        size: rec.size,
        link: rec.link,
        url: rec.url,
        header: rec.header,
        previewName: rec.tinyName,
        previewAlt: rec.tinyAlt,
        previewTitle: rec.tinyTitle,
        previewWidth: rec.tinyWidth,
        previewHeight: rec.tinyHeight,
        mime: picture.mime,
        views: +rec.views,
        downloads: +rec.downloads,
        created: rec.createdDate,
        tags: picture.tags,
      });
    }

    return recommendeds;
  }

  @Get('/')
  async items(
    @Res({ passthrough: true }) res: Response,
    @Query() query: ItemsQueryDto,
  ): Promise<PictureDataSmallDto[]> {
    const items: PictureDataSmallDto[] = [];
    const page = query.page || 1;
    const limit = query.limit || 25;

    const params = {
      offset: (page - 1) * limit,
      limit: limit,
      sort: query.sort || SortEnum.fresh,
      direction: query.direction || 'desc',
      search: query.search,
      fromWidth: query.fromWidth,
      fromHeight: query.fromHeight,
      toWidth: query.toWidth,
      toHeight: query.toHeight,
      tags: query.tags,
    };

    const recs = await this.pictureRepository.getItems(params);

    for (const rec of recs.recs) {
      const picture = await this.pictureRepository.getById(+rec.id);

      if (!picture) {
        throw new InternalServerErrorException('Picture not found');
      }

      items.push({
        id: +rec.id,
        width: rec.width,
        height: rec.height,
        size: rec.size,
        link: rec.link,
        url: rec.url,
        header: rec.header,
        previewName: rec.smallName,
        previewAlt: rec.smallAlt,
        previewTitle: rec.smallTitle,
        previewWidth: rec.smallWidth,
        previewHeight: rec.smallHeight,
        mime: picture.mime,
        created: rec.createdDate,
        views: +rec.views,
        downloads: +rec.downloads,
        tags: picture.tags,
      });
    }

    res.set('Pagination-Total', recs.count.toString());
    res.set('Pagination-Limit', limit.toString());

    return items;
  }
}
