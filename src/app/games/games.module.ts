/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
