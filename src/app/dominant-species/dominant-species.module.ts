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
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SharedModule} from "../shared/shared.module";
import {DominantSpeciesProvider} from "./dominant-species.provider";
import {GAME_PROVIDERS} from "../shared/api";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MainComponent} from './main/main.component';
import {BoardComponent} from "./board/board.component";
import {ActionSpaceComponent} from "./action-space/action-space.component";
import {ActionDisplayComponent} from "./action-display/action-display.component";
import {NgxPanZoomModule} from "ngx-panzoom";
import { ActionBarComponent } from './action-bar/action-bar.component';
import { PlayerComponent } from './player/player.component';
import { ElementSpaceComponent } from './element-space/element-space.component';
import { DrawBagComponent } from './draw-bag/draw-bag.component';
import { WanderlustTilesComponent } from './wanderlust-tiles/wanderlust-tiles.component';
import { ActionPawnComponent } from './action-pawn/action-pawn.component';
import en from './locale/en.json';
import nl from "./locale/nl.json";
import { InitiativeMarkerComponent } from './initiative-marker/initiative-marker.component';
import { ElementComponent } from './element/element.component';
import { ElementPopoverComponent } from './element-popover/element-popover.component';
import { BonusPointsTableComponent } from './bonus-points-table/bonus-points-table.component';
import { ScoringTableComponent } from './scoring-table/scoring-table.component';
import { FoodChainComponent } from './food-chain/food-chain.component';
import { TilePopoverComponent } from './tile-popover/tile-popover.component';
import { CardsDisplayComponent } from './cards-display/cards-display.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent,
    BoardComponent,
    ActionSpaceComponent,
    ActionDisplayComponent,
    ActionBarComponent,
    PlayerComponent,
    ElementSpaceComponent,
    DrawBagComponent,
    WanderlustTilesComponent,
    ActionPawnComponent,
    InitiativeMarkerComponent,
    ElementComponent,
    ElementPopoverComponent,
    BonusPointsTableComponent,
    ScoringTableComponent,
    FoodChainComponent,
    TilePopoverComponent,
    CardsDisplayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    SharedModule,
    NgxPanZoomModule
  ],
  exports: [
    MainComponent
  ]
})
export class DominantSpeciesModule {

  constructor(private provider: DominantSpeciesProvider,
              private translateService: TranslateService) {
    GAME_PROVIDERS['ds'] = provider;

    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('nl', nl, true);
  }

}

