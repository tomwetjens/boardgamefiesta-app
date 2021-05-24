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
