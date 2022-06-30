import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { PictureModule } from './picture/picture.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([], {
      initialNavigation: 'enabledBlocking',
    }),
    HttpClientModule,
    AdminModule,
    PictureModule,
  ],
  providers: [SsrCookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
