import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PictureRepository } from '../picture/picture.repository';
import { EnvironmentVariables } from '../../env.validation';

@Controller()
export class IndexController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    @InjectRepository(PictureRepository)
    private readonly pictureRepository: PictureRepository,
  ) {}

  @Get('/robots.txt')
  @Header('Content-Type', 'text/plain')
  async robots(): Promise<string> {
    return [
      'User-agent: *',
      'Disallow: /admin/',
      'Disallow: *?*',
      '',
      `Sitemap: ${this.configService.get('APP_URL')}/sitemap.xml`,
    ].join('\r\n');
  }

  @Get('/sitemap.xml')
  @Header('Content-Type', 'text/xml')
  async sitemap(): Promise<string> {
    const items = await this.pictureRepository.getSitemapItems();

    let sitemap =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

    items.forEach((item) => {
      sitemap += `<url><loc>${this.configService.get('APP_URL')}/${item.url}-${
        item.id
      }</loc><lastmod>${item.updated.toISOString()}</lastmod><image:image><image:loc>${this.configService.get(
        'APP_URL',
      )}/api/picture/${item.id}/preview/${
        item.name
      }.webp</image:loc><image:title>${
        item.title
      }</image:title><image:caption>${
        item.alt
      }</image:caption></image:image></url>`;
    });

    sitemap += '</urlset>';

    return sitemap;
  }
}
