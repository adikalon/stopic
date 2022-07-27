import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { PictureInterface } from './interfaces/picture.interface';
import { PicturesGetInterface } from './interfaces/pictures-get.interface';

const picturesStateKey = makeStateKey<PicturesGetInterface>('PICTURES');
const picturesErrorStateKey = makeStateKey<HttpErrorResponse>('PICTURES_ERROR');

@Injectable()
export class ListService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly httpClient: HttpClient,
    private readonly transferState: TransferState,
    private readonly configService: ConfigService,
  ) {}

  async getPictures(
    params: any,
    refresh = false,
  ): Promise<PicturesGetInterface> {
    const query = new URLSearchParams();

    if (params.page) {
      query.append('page', params.page);
    }

    if (params.limit) {
      query.append('limit', params.limit);
    }

    if (params.sort) {
      query.append('sort', params.sort);
    }

    if (params.direction) {
      query.append('direction', params.direction);
    }

    if (params.search) {
      query.append('search', params.search);
    }

    if (params.fromWidth) {
      query.append('fromWidth', params.fromWidth);
    }

    if (params.fromHeight) {
      query.append('fromHeight', params.fromHeight);
    }

    if (params.toWidth) {
      query.append('toWidth', params.toWidth);
    }

    if (params.toHeight) {
      query.append('toHeight', params.toHeight);
    }

    if (params.tags) {
      query.append('tags', params.tags);
    }

    if (isPlatformServer(this.platformId)) {
      try {
        const req = this.httpClient.get<PictureInterface[]>(
          `http://server:3000/api/picture?${query.toString()}`,
          {
            observe: 'response',
          },
        );

        const res = await lastValueFrom(req);
        const total = res.headers.get('Pagination-Total');
        const limit = res.headers.get('Pagination-Limit');
        const resp: PicturesGetInterface = {
          total: total ? +total : 0,
          limit: limit ? +limit : 0,
          data: res.body as PictureInterface[],
        };

        this.transferState.set(picturesStateKey, resp);

        return resp;
      } catch (err: any) {
        if (err instanceof HttpErrorResponse) {
          this.transferState.set(picturesErrorStateKey, err);
        }

        throw err;
      }
    } else {
      if (refresh) {
        const config = await this.configService.getConfig();
        const req = this.httpClient.get<PictureInterface[]>(
          `${config.appUrl}/api/picture?${query.toString()}`,
          {
            observe: 'response',
          },
        );

        const res = await lastValueFrom(req);
        const total = res.headers.get('Pagination-Total');
        const limit = res.headers.get('Pagination-Limit');
        const resp: PicturesGetInterface = {
          total: total ? +total : 0,
          limit: limit ? +limit : 0,
          data: res.body as PictureInterface[],
        };

        return resp;
      }

      if (this.transferState.hasKey(picturesErrorStateKey)) {
        throw this.transferState.get(
          picturesErrorStateKey,
          new HttpErrorResponse({ error: 'Error while getting data' }),
        );
      }

      return this.transferState.get(picturesStateKey, {
        total: 0,
        limit: 0,
        data: [],
      });
    }
  }
}
