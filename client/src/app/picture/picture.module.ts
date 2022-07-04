import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ListComponent } from './pages';
import { PictureComponent } from './picture.component';
import { PictureRoutingModule } from './picture.routing.module';

@NgModule({
  declarations: [PictureComponent, ListComponent],
  imports: [PictureRoutingModule, BrowserAnimationsModule, ToastModule],
  providers: [MessageService],
})
export class PictureModule {}
