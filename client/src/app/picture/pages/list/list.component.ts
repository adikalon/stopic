import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PictureInterface } from './interfaces/picture.interface';
import { ListService } from './list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService, ListService],
})
export class ListComponent implements AfterViewInit {
  isServer: boolean;
  pictures: PictureInterface[] = [];
  progress = false;
  page!: number;
  limit!: number;
  total!: number;
  query: any;
  error: string | undefined;

  constructor(
    private readonly messageService: MessageService,
    private readonly listService: ListService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: any,
  ) {
    this.isServer = isPlatformServer(this.platformId);

    this.router.events.subscribe((event) => {
      this.progress = true;
      if (event instanceof NavigationEnd) {
        this.query = {};
        const refresh = event.id !== 1;
        const params = event.url.replace(/^.*\/\??/, '');

        if (params) {
          params.split('&').forEach((param) => {
            const pair = param.split('=');

            if (pair[0] && pair[1]) {
              this.query[pair[0]] = pair[1];
            }
          });
        }

        this.listService
          .getPictures(this.query, refresh)
          .then((pictures) => {
            this.page = isNaN(+this.query['page']) ? 1 : this.query['page'];
            this.pictures = pictures.data;
            this.limit = pictures.limit;
            this.total = pictures.total;
          })
          .catch((err: any) => {
            if (typeof err.error === 'string') {
              this.error = err.error;
            }

            console.error(err);
          })
          .finally(() => (this.progress = false));
      }
    });
  }

  async paginate(event: any) {
    if (event.page + 1 !== this.page || event.rows !== this.limit) {
      this.query['page'] = event.page + 1;
      this.query['limit'] = event.rows;

      await this.router.navigate(['/'], { queryParams: this.query });
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.error) {
      this.messageService.add({
        severity: 'error',
        sticky: true,
        summary: 'Sorry, an error has occurred :(',
        detail: this.error,
      });
    }
  }
}
