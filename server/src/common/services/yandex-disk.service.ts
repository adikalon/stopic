import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { EnvironmentVariables } from '../../env.validation';

@Injectable()
export class YandexDiskService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async upload(subFolder: string, filePath: string): Promise<void> {
    const p = await lastValueFrom(
      this.httpService
        .request({
          method: 'PUT',
          url: 'https://cloud-api.yandex.net/v1/disk/resources',
          params: {
            path: subFolder,
          },
          headers: {
            Authorization: `OAuth ${this.configService.get('YANDEX_DISK_KEY')}`,
          },
        })
        .pipe(map((res) => res.data)),
    );

    console.log(p);
    console.log(filePath);
  }
}
