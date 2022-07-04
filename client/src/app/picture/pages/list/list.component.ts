import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  constructor(
    private readonly httpClient: HttpClient,
    private messageService: MessageService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const pictures = await lastValueFrom(
        this.httpClient.get(`${environment.appUrl}/api/picture`),
      );

      console.log(pictures);
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
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
