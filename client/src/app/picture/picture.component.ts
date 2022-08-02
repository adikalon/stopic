import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TagInterface } from './interfaces/tag.interface';
import { PictureService } from './picture.service';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss'],
  providers: [MessageService, PictureService],
})
export class PictureComponent implements OnInit {
  tags: TagInterface[] = [];
  showTags = false;
  showFilter = false;
  searchText = '';
  minWidth: number | null = null;
  maxWidth: number | null = null;
  minHeight: number | null = null;
  maxHeight: number | null = null;

  constructor(
    private readonly pictureService: PictureService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.tags = await this.pictureService.getTags();
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

  async search(params: any) {
    await this.router.navigate(['/'], {
      queryParams: params,
    });
  }

  async switchTags() {
    this.showTags = !this.showTags;

    if (this.showFilter) {
      this.showFilter = false;
    }
  }

  async switchFilter() {
    this.showFilter = !this.showFilter;

    if (this.showTags) {
      this.showTags = false;
    }
  }

  async getResult() {
    const params: any = {};

    if (this.searchText) {
      params['search'] = this.searchText;
    }

    if (this.showFilter) {
      if (this.minWidth) {
        params['fromWidth'] = this.minWidth;
      }

      if (this.minHeight) {
        params['fromHeight'] = this.minHeight;
      }

      if (this.maxWidth) {
        params['toWidth'] = this.maxWidth;
      }

      if (this.maxHeight) {
        params['toHeight'] = this.maxHeight;
      }
    }

    await this.router.navigate(['/'], {
      queryParams: params,
    });
  }
}
