import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {TableComponent} from './table/table.component';
import {HomeComponent} from './home/home.component';
import {CreateTableComponent} from './create-table/create-table.component';
import {LayoutComponent} from './layout/layout.component';
import {TestComponent} from './test/test.component';


const routes: Routes = [
  {
    path: 'table/:id',
    component: TableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test',
    component: TestComponent
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
        path: 'create',
        component: CreateTableComponent,
        canActivate: [AuthGuard],
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
