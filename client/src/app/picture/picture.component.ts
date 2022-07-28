import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TagInterface } from './interfaces/tag.interface';
import { PictureService } from './picture.service';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  providers: [MessageService, PictureService],
})
export class PictureComponent implements OnInit {
  tags: TagInterface[] = [];
  showTags = false;

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
}
