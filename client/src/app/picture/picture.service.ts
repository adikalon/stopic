import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { TagInterface } from './interfaces/tag.interface';

const tagsStateKey = makeStateKey<TagInterface[]>('TAGS');
const tagsErrorStateKey = makeStateKey<HttpErrorResponse>('TAGS_ERROR');

@Injectable()
export class PictureService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly httpClient: HttpClient,
    private readonly transferState: TransferState,
  ) {}

  async getTags(): Promise<TagInterface[]> {
    if (isPlatformServer(this.platformId)) {
      try {
        const req = this.httpClient.get<TagInterface[]>(
          'http://server:3000/api/tag/popular',
        );

        const res = await lastValueFrom(req);
        this.transferState.set(tagsStateKey, res);

        return res;
      } catch (err: any) {
        if (err instanceof HttpErrorResponse) {
          this.transferState.set(tagsErrorStateKey, err);
        }

        throw err;
      }
    } else {
      if (this.transferState.hasKey(tagsErrorStateKey)) {
        throw this.transferState.get(
          tagsErrorStateKey,
          new HttpErrorResponse({ error: 'Error while getting data' }),
        );
      }

      return this.transferState.get(tagsStateKey, []);
    }
  }
}
