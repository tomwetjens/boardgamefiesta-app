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
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SharedModule} from "../shared/shared.module";
import {GAME_PROVIDERS} from "../shared/api";
import {PowerGridComponent} from './power-grid/power-grid.component';
import {PowerGridProvider} from "./power-grid.provider";
import {BoardComponent} from './board/board.component';
import {PowerPlantComponent} from './power-plant/power-plant.component';
import {MapComponent} from './map/map.component';
import {PowerPlantMarketComponent} from './power-plant-market/power-plant-market.component';
import {ResourceMarketComponent} from './resource-market/resource-market.component';
import {AuctionComponent} from './auction/auction.component';
import {ElektroComponent} from './elektro/elektro.component';
import {UpDownComponent} from './up-down/up-down.component';
import {PlayerOrderComponent} from './player-order/player-order.component';
import {PlayerHouseComponent} from './player-house/player-house.component';
import {ConnectedCitiesComponent} from './connected-cities/connected-cities.component';
import {PlayerComponent} from './player/player.component';
import {ActionBarComponent} from './action-bar/action-bar.component';
import en from "./locale/en.json";

const ID = 'power-grid';

const routes: Routes = [
  {
    path: '',
    component: PowerGridComponent
  }
];

@NgModule({
  declarations: [
    PowerGridComponent,
    BoardComponent,
    PowerPlantComponent,
    MapComponent,
    PowerPlantMarketComponent,
    ResourceMarketComponent,
    AuctionComponent,
    ElektroComponent,
    UpDownComponent,
    PlayerOrderComponent,
    PlayerHouseComponent,
    ConnectedCitiesComponent,
    PlayerComponent,
    ActionBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: []
})
export class PowerGridModule {

  constructor(private provider: PowerGridProvider,
              private translateService: TranslateService) {
    GAME_PROVIDERS[ID] = provider;

    this.translateService.setTranslation('en', en, true);
  }
}
