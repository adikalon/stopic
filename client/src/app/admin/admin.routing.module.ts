import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';
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
        canActivate: [AdminGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'picture',
        component: ListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'picture/:id',
        component: EditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'tag',
        component: TagListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: '**',
        component: NotFoundComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
