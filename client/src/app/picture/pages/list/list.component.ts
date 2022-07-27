import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { PictureInterface } from './interfaces/picture.interface';
import { ListService } from './list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService, ListService],
})
export class ListComponent implements OnInit, AfterViewInit {
  isServer: boolean;
  pictures: PictureInterface[] = [];
  progress = false;
  page!: number;
  limit!: number;
  total!: number;

  @ViewChild('paginatorTop', { static: false }) paginatorTop!: Paginator;
  @ViewChild('paginatorBottom', { static: false }) paginatorBottom!: Paginator;

  constructor(
    private readonly messageService: MessageService,
    private readonly listService: ListService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: any,
  ) {
    this.isServer = isPlatformServer(this.platformId);
  }

  async paginate(event: any) {
    if (event.page + 1 !== this.page || event.rows !== this.limit) {
      this.progress = true;
      const queryParams = this.route.snapshot.queryParams;
      const params = Object.assign({}, queryParams);

      if (event.page + 1 !== this.page) {
        params['page'] = event.page + 1;
      }

      if (event.rows !== this.limit) {
        params['limit'] = event.rows;
      }

      try {
        const pictures = await this.listService.getPictures(params, true);
        this.page = isNaN(+params['page']) ? 1 : params['page'];
        this.pictures = pictures.data;
        this.limit = pictures.limit;
        this.total = pictures.total;

        await this.router.navigate([], {
          relativeTo: this.route,
          queryParams: params,
          queryParamsHandling: 'merge',
        });

        setTimeout(() => {
          this.paginatorTop.changePage(this.page - 1);
          this.paginatorBottom.changePage(this.page - 1);
        });

        this.progress = false;
      } catch (err: any) {
        if (typeof err.error === 'string') {
          this.messageService.add({
            severity: 'error',
            sticky: true,
            summary: 'Sorry, an error has occurred :(',
            detail: err.error,
          });
        }
      }
    }
  }

  async ngOnInit(): Promise<void> {
    const queryParams = this.route.snapshot.queryParams;

    try {
      const pictures = await this.listService.getPictures(queryParams);
      this.page = isNaN(+queryParams['page']) ? 1 : queryParams['page'];
      this.pictures = pictures.data;
      this.limit = pictures.limit;
      this.total = pictures.total;
    } catch (err: any) {
      if (typeof err.error === 'string') {
        this.messageService.add({
          severity: 'error',
          sticky: true,
          summary: 'Sorry, an error has occurred :(',
          detail: err.error,
        });
      }

      console.error(err);
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isServer) {
      setTimeout(() => {
        this.paginatorTop.changePage(this.page - 1);
        this.paginatorBottom.changePage(this.page - 1);
      });
    }
  }
}
