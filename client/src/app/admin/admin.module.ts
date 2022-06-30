import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin.routing.module';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';

@NgModule({
  declarations: [AdminComponent],
  imports: [AdminRoutingModule],
  providers: [AdminGuard],
})
export class AdminModule {}
