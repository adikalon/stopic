import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { PictureInterface } from './interfaces/picture.interface';

const keyPictures = makeStateKey('PICTURES');
const keyPicturesError = makeStateKey('PICTURES_ERROR');

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService],
})
export class ListComponent implements OnInit {
  pictures: PictureInterface[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly httpClient: HttpClient,
    private readonly messageService: MessageService,
    private readonly transferState: TransferState,
  ) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      try {
        this.pictures = (await lastValueFrom(
          this.httpClient.get('http://server:3000/api/picture'),
        )) as PictureInterface[];

        this.transferState.set(keyPictures, this.pictures as any);
      } catch (err: any) {
        if (err instanceof HttpErrorResponse) {
          this.transferState.set(keyPicturesError, err.error as any);

          this.messageService.add({
            severity: 'error',
            sticky: true,
            summary: 'Sorry, an error has occurred :(',
            detail: err.error,
          });
        }

        console.error(err);
      }
    } else {
      if (this.transferState.hasKey(keyPicturesError)) {
        this.messageService.add({
          severity: 'error',
          sticky: true,
          summary: 'Sorry, an error has occurred :(',
          detail: await this.transferState.get(keyPicturesError, '' as any),
        });

        this.transferState.remove(keyPicturesError);
      } else {
        this.pictures = await this.transferState.get(keyPictures, [] as any);
      }
    }
  }
}
