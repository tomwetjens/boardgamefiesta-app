import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { RankingComponent } from './ranking/ranking.component';
import {SharedModule} from "../shared/shared.module";

const routes: Routes = [
  {
    path: ':id',
    component: GameComponent
  }
];

@NgModule({
  declarations: [
    GameComponent,
    RankingComponent
  ],
    imports: [
        CommonModule,
        NgbModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild({
            extend: true
        }),
        SharedModule
    ],
  exports: [RouterModule]
})
export class GamesModule {
}
