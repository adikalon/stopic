import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TagDataPopularDto } from './dto/tag-data-popular.dto';
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

  @Get('/popular')
  async popular(): Promise<TagDataPopularDto[]> {
    return await this.tagRepository.getPopular(1000);
  }
}
