import { Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly ssrCookieService: SsrCookieService,
    private readonly httpClient: HttpClient,
  ) {}

  async canActivate(): Promise<boolean> {
    const auth = this.ssrCookieService.get('auth');

    if (!auth) {
      await this.router.navigate(['/admin/login']);
      return false;
    }

    try {
      await lastValueFrom(
        this.httpClient.post(`${environment.appUrl}/api/visitor/auth`, null, {
          headers: { Authorization: `Bearer ${auth}` },
        }),
      );

      return true;
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
        console.error(err.error);
      }

      await this.router.navigate(['/admin/login']);
    }

    return false;
  }
}
