import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CreateComponent } from './pages/picture/create/create.component';
import { EditComponent } from './pages/picture/edit/edit.component';
import { ListComponent } from './pages/picture/list/list.component';
import { ListComponent as TagListComponent } from './pages/tag/list/list.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: CreateComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'picture',
        component: ListComponent,
      },
      {
        path: 'picture/:id',
        component: EditComponent,
      },
      {
        path: 'tag',
        component: TagListComponent,
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
export class AdminRoutingModule {}
