import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
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
    AdminModule,
    PictureModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
