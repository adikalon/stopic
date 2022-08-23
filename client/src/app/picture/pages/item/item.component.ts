import { isPlatformServer } from '@angular/common';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { ErrorInterface } from './interfaces/error.interface';
import { PictureInterface } from './interfaces/picture.interface';
import { RecommendedInterface } from './interfaces/recommended.interface';
import { ItemService } from './item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  providers: [ItemService],
})
export class ItemComponent {
  progress = true;
  picture: PictureInterface | undefined;
  recommended: RecommendedInterface[] | undefined;
  error: ErrorInterface | undefined;

  constructor(
    @Optional() @Inject(RESPONSE) private response: any,
    private readonly itemService: ItemService,
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const match = event.url
          .replace(/\?.+/, '')
          .match(/^\/(?<url>.+)-(?<id>\d+)$/);

        if (!match) {
          if (isPlatformServer(this.platformId)) {
            this.response.statusCode = 404;
            this.response.statusMessage = 'Not Found';
          }

          this.error = {
            error: 'Not Found',
            message: 'Incorrect link',
          };

          this.progress = false;
          return;
        }

        const id = match.groups?.['id'] as unknown as number;
        const url = match.groups?.['url'] as unknown as string;

        Promise.all([
          this.itemService.getPicture(id, event.id !== 1),
          this.itemService.getRecommended(id, event.id !== 1),
        ])
          .then((res) => {
            if (res[0].url !== url) {
              throw {
                status: 404,
                statusText: 'Not Found',
                error: 'Incorrect link',
              };
            }
            this.picture = res[0];
            this.recommended = res[1];
          })
          .catch((err: any) => {
            if (isPlatformServer(this.platformId)) {
              if (typeof err.status === 'number') {
                this.response.statusCode = err.status;
              }

              if (typeof err.statusText === 'string') {
                this.response.statusMessage = err.statusText;
              }
            }

            if (typeof err.error === 'string') {
              this.error = {
                error:
                  typeof err.statusText === 'string' ? err.statusText : 'Error',
                message: err.error,
              };
            }

            console.error(err);
          })
          .finally(() => (this.progress = false));
      }
    });
  }

  async search(params: any) {
    await this.router.navigate(['/'], {
      queryParams: params,
    });
  }
}
