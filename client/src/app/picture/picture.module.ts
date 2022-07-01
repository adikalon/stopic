import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages';
import { PictureComponent } from './picture.component';
import { PictureRoutingModule } from './picture.routing.module';

@NgModule({
  declarations: [PictureComponent, ListComponent],
  imports: [PictureRoutingModule, SharedModule],
  providers: [],
})
export class PictureModule {}
