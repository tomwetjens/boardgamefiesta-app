import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {TableComponent} from './table/table.component';
import {HomeComponent} from './home/home.component';
import {LayoutComponent} from './layout/layout.component';
import {ProfileComponent} from './profile/profile.component';
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";
import {PrivacyComponent} from "./privacy/privacy.component";
import {FaqComponent} from "./faq/faq.component";
import {GameTablesComponent} from "./game-tables/game-tables.component";

const routes: Routes = [
  {
    path: 'gwt/:tableId',
    component: TableComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./gwt/gwt.module').then(m => m.GwtModule)
      }
    ]
  },
  {
    path: 'big-bazar/:tableId',
    component: TableComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./big-bazar/big-bazar.module').then(m => m.BigBazarModule)
      }
    ]
  },
  // {
  //   path: 'power-grid/:tableId',
  //   component: TableComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./power-grid/power-grid.module').then(m => m.PowerGridModule)
  //     }
  //   ]
  // },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
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
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'games',
        loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'tables/:gameId',
        component: GameTablesComponent
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
