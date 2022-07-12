import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PictureInterface } from './interfaces/picture.interface';
import { ListService } from './list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService, ListService],
})
export class ListComponent implements OnInit {
  pictures: PictureInterface[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly listService: ListService,
    private readonly route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    const queryParams = this.route.snapshot.queryParams;

    try {
      const pictures = await this.listService.getPictures(queryParams);
      this.pictures = pictures.data;
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
}
