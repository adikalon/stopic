import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';
import { ItemComponent, ListComponent } from './pages';
import { PictureComponent } from './picture.component';
import { PictureRoutingModule } from './picture.routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ServerPaginator } from './pages/list/components/server-paginator/server-paginator';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    PictureComponent,
    ListComponent,
    ServerPaginator,
    ItemComponent,
  ],
  imports: [
    PictureRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    DataViewModule,
    ImageModule,
    PaginatorModule,
    ProgressBarModule,
    TagModule,
  ],
})
export class PictureModule {}
