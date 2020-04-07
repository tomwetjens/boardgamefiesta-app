import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {CreateGameComponent} from './create-game/create-game.component';
import {LobbyComponent} from './lobby/lobby.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'create',
    component: CreateGameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lobby/:id',
    component: LobbyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'games/:id',
    component: GameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
