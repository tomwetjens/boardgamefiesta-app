import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {TableComponent} from './table/table.component';
import {HomeComponent} from './home/home.component';
import {LayoutComponent} from './layout/layout.component';
import {ProfileComponent} from './profile/profile.component';
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";

const routes: Routes = [
  {
    path: 'table/:id',
    component: TableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
