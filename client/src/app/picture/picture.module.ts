import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';
import { ListComponent } from './pages';
import { PictureComponent } from './picture.component';
import { PictureRoutingModule } from './picture.routing.module';

@NgModule({
  declarations: [PictureComponent, ListComponent],
  imports: [
    PictureRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    DataViewModule,
    ImageModule,
  ],
  providers: [MessageService],
})
export class PictureModule {}
