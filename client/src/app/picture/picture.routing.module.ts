import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent, ListComponent } from './pages/';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PictureComponent } from './picture.component';

const routes: Routes = [
  {
    path: '',
    component: PictureComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      {
        path: ':id',
        component: ItemComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PictureRoutingModule {}
