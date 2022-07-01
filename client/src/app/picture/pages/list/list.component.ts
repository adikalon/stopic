import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  error: string | undefined;

  constructor(private readonly httpClient: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const pictures = await lastValueFrom(
        this.httpClient.get(`${environment.appUrl}/api/picture`),
      );

      console.log(pictures);
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
        this.error = err.error;
      }

      console.error(err);
    }
  }
}
