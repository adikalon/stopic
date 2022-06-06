import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { EnvironmentVariables } from '../../env.validation';
import * as crypto from 'crypto';

@Injectable()
export class CatCutService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async shorten(link: string, comment: string): Promise<string> {
    const hash =
      link +
      this.configService.get('CATCUT_APP_ID').toString() +
      '1' +
      comment +
      this.configService.get('CATCUT_APP_SECRET').toString();

    const formData = new URLSearchParams();
    formData.append('longurl', link);
    formData.append('id', this.configService.get('CATCUT_APP_ID').toString());
    formData.append('advsurfing', '1');
    formData.append('comment', comment);
    formData.append(
      'hash',
      crypto.createHash('sha1').update(hash).digest('hex'),
    );

    const createLink = await lastValueFrom(
      this.httpService.request({
        method: 'POST',
        url: 'https://catcut.net/api/create.php',
        data: formData,
        timeout: 15000,
        validateStatus: () => true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    const shortenLink = createLink.data.toString().trim();

    if (
      !shortenLink ||
      shortenLink === '0' ||
      shortenLink.indexOf('error') !== -1
    ) {
      throw new Error(`Shorten link failed. Response: ${shortenLink}`);
    }

    return `${this.configService.get('CATCUT_URL')}/${shortenLink}`;
  }
}
