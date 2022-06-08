import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TagDataPopularDto } from './dto/tag-data-popular.dto';
import { TagDataDto } from './dto/tag-data.dto';
import { TagRepository } from './tag.repository';

@Controller('tag')
export class TagController {
  constructor(
    @InjectRepository(TagRepository)
    private readonly tagRepository: TagRepository,
  ) {}

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.tagRepository.hide(id);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  async restore(@Param('id') id: number): Promise<void> {
    await this.tagRepository.show(id);
  }

  @Get('/')
  @UseGuards(AdminGuard)
  async tags(
    @Res({ passthrough: true }) res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('deleted') deleted?: boolean,
  ): Promise<TagDataDto[]> {
    page = page || 1;
    limit = !limit || limit > 1000 ? 1000 : limit;
    deleted = deleted || false;
    const offset = (page - 1) * limit;
    const count = await this.tagRepository.getCount(deleted);
    res.set('Pagination-Total', count.toString());
    res.set('Pagination-Limit', limit.toString());

    return await this.tagRepository.getPaginated({
      limit,
      offset,
      deleted,
      search,
    });
  }

  @Get('/popular')
  async popular(): Promise<TagDataPopularDto[]> {
    return await this.tagRepository.getPopular(1000);
  }
}
