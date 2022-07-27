import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../../../core/services/config.service';

interface Page {
  page: number;
  link: string;
}

@Component({
  selector: 'app-server-paginator',
  templateUrl: './server-paginator.component.html',
  styleUrls: ['./server-paginator.scss'],
})
export class ServerPaginator implements OnChanges {
  constructor(
    private readonly configService: ConfigService,
    private readonly route: ActivatedRoute,
  ) {}

  @Input() limit: number | undefined;
  @Input() total: number | undefined;

  first: string | undefined;
  prev: string | undefined;
  previous: Page[] = [];
  page = 1;
  follow: Page[] = [];
  next: string | undefined;
  last: string | undefined;

  async ngOnChanges() {
    if (!this.limit || !this.total) {
      return;
    }

    const config = await this.configService.getConfig();
    const totalPages = Math.ceil(this.total / this.limit);
    const queryParams = this.route.snapshot.queryParams;
    const params = Object.assign({}, queryParams);
    let query = new URLSearchParams(params).toString();

    if (queryParams['page']) {
      this.page = +queryParams['page'];
    }

    if (this.page > 1) {
      params['page'] = 1;
      query = new URLSearchParams(params).toString();
      this.first = `${config.appUrl}/?${query}`;
      params['page'] = this.page - 1;
      query = new URLSearchParams(params).toString();
      this.prev = `${config.appUrl}/?${query}`;
      const len = totalPages - this.page > 2 ? 2 : totalPages - this.page;

      for (let p = this.page - 1; p >= 1; p--) {
        params['page'] = p;
        query = new URLSearchParams(params).toString();
        this.previous.unshift({
          page: p,
          link: `${config.appUrl}/?${query}`,
        });

        if (this.previous.length >= 4 - len) {
          break;
        }
      }
    }

    if (this.page < totalPages) {
      params['page'] = totalPages;
      query = new URLSearchParams(params).toString();
      this.last = `${config.appUrl}/?${query}`;
      params['page'] = this.page + 1;
      query = new URLSearchParams(params).toString();
      this.next = `${config.appUrl}/?${query}`;

      const len = this.page > 2 ? 2 : this.page - 1;

      for (let p = this.page + 1; p <= totalPages; p++) {
        params['page'] = p;
        query = new URLSearchParams(params).toString();
        this.follow.push({
          page: p,
          link: `${config.appUrl}/?${query}`,
        });

        if (this.follow.length >= 4 - len) {
          break;
        }
      }
    }
  }
}
