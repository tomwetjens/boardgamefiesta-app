import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: ':id',
    component: GameComponent
  }
];

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      extend: true
    })
  ],
  exports: [RouterModule]
})
export class GamesModule {
}
