import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { PictureInterface } from './interfaces/picture.interface';
import { RecommendedInterface } from './interfaces/recommended.interface';

const pictureStateKey = makeStateKey<PictureInterface>('PICTURE');
const pictureErrorStateKey = makeStateKey<HttpErrorResponse>('PICTURE_ERROR');
const recommendedStateKey = makeStateKey<RecommendedInterface[]>('RECOMMENDED');
const recommendedErrorStateKey =
  makeStateKey<HttpErrorResponse>('RECOMMENDED_ERROR');

@Injectable()
export class ItemService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly httpClient: HttpClient,
    private readonly transferState: TransferState,
    private readonly configService: ConfigService,
  ) {}

  async getPicture(
    pictureId: number,
    refresh = false,
  ): Promise<PictureInterface> {
    if (isPlatformServer(this.platformId)) {
      try {
        const req = this.httpClient.get<PictureInterface>(
          `http://server:3000/api/picture/${pictureId}`,
        );

        const res = await lastValueFrom(req);
        this.transferState.set(pictureStateKey, res);

        return res;
      } catch (err: any) {
        if (err instanceof HttpErrorResponse) {
          this.transferState.set(pictureErrorStateKey, err);
        }

        throw err;
      }
    } else {
      if (refresh) {
        const config = await this.configService.getConfig();
        const req = this.httpClient.get<PictureInterface>(
          `${config.appUrl}/api/picture/${pictureId}`,
        );

        return await lastValueFrom(req);
      }

      if (this.transferState.hasKey(pictureErrorStateKey)) {
        throw this.transferState.get(
          pictureErrorStateKey,
          new HttpErrorResponse({ error: 'Error while getting data' }),
        );
      }

      return this.transferState.get(pictureStateKey, {} as PictureInterface);
    }
  }

  async getRecommended(pictureId: number, refresh = false) {
    if (isPlatformServer(this.platformId)) {
      try {
        const req = this.httpClient.get<RecommendedInterface[]>(
          `http://server:3000/api/picture/recommended/${pictureId}`,
        );

        const res = await lastValueFrom(req);
        this.transferState.set(recommendedStateKey, res);

        return res;
      } catch (err: any) {
        if (err instanceof HttpErrorResponse) {
          this.transferState.set(recommendedErrorStateKey, err);
        }

        throw err;
      }
    } else {
      if (refresh) {
        const config = await this.configService.getConfig();
        const req = this.httpClient.get<RecommendedInterface[]>(
          `${config.appUrl}/api/picture/recommended/${pictureId}`,
        );

        return await lastValueFrom(req);
      }

      if (this.transferState.hasKey(recommendedErrorStateKey)) {
        throw this.transferState.get(
          recommendedErrorStateKey,
          new HttpErrorResponse({ error: 'Error while getting data' }),
        );
      }

      return this.transferState.get(recommendedStateKey, []);
    }
  }
}
