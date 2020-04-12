import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {CreateGameComponent} from './create-game/create-game.component';
import {LayoutComponent} from './layout/layout.component';


const routes: Routes = [
  {
    path: 'games/:id',
    component: GameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'create',
        component: CreateGameComponent,
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
