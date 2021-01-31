import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GwtBoardComponent} from './board/gwt-board.component';
import {CardComponent} from './card/card.component';
import {CardStackComponent} from './card-stack/card-stack.component';
import {CattleMarketComponent} from './cattle-market/cattle-market.component';
import {DeliveryCityComponent} from './delivery-city/delivery-city.component';
import {EndedDialogComponent} from './ended-dialog/ended-dialog.component';
import {HazardComponent} from './hazard/hazard.component';
import {ObjectiveCardsComponent} from './objective-cards/objective-cards.component';
import {ObjectivesDialogComponent} from './objectives-dialog/objectives-dialog.component';
import {PlayerBoardComponent} from './player-board/player-board.component';
import {PlayerBuildingsComponent} from './player-buildings/player-buildings.component';
import {StationMasterComponent} from './station-master/station-master.component';
import {TeepeeComponent} from './teepee/teepee.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {TrailComponent} from './trail/trail.component';
import {SharedModule} from '../shared/shared.module';
import {GAME_PROVIDERS} from '../shared/api';
import {DiscardPileDialogComponent} from './discard-pile-dialog/discard-pile-dialog.component';
import {DrawStackDialogComponent} from './draw-stack-dialog/draw-stack-dialog.component';
import {BuyCattleDialogComponent} from './buy-cattle-dialog/buy-cattle-dialog.component';
import {RouterModule, Routes} from "@angular/router";
import {GwtComponent} from './gwt/gwt.component';
import {GwtProvider} from "./gwt.provider";
import en from "./locale/en.json";
import it from "./locale/it.json";
import nl from "./locale/nl.json";
import pt from "./locale/pt.json";
import {BiddingComponent} from './bidding/bidding.component';
import {LocationPopoverComponent} from './location-popover/location-popover.component';
import {BuildingPopoverComponent} from './building-popover/building-popover.component';
import {HazardPopoverComponent} from './hazard-popover/hazard-popover.component';
import { BonusStationMastersComponent } from './bonus-station-masters/bonus-station-masters.component';

const routes: Routes = [
  {
    path: '',
    component: GwtComponent
  }
];

@NgModule({
  declarations: [
    GwtBoardComponent,
    CardComponent,
    CardStackComponent,
    CattleMarketComponent,
    DeliveryCityComponent,
    DiscardPileDialogComponent,
    EndedDialogComponent,
    HazardComponent,
    ObjectiveCardsComponent,
    ObjectivesDialogComponent,
    PlayerBoardComponent,
    PlayerBuildingsComponent,
    StationMasterComponent,
    TeepeeComponent,
    TrailComponent,
    DrawStackDialogComponent,
    BuyCattleDialogComponent,
    GwtComponent,
    BiddingComponent,
    LocationPopoverComponent,
    BuildingPopoverComponent,
    HazardPopoverComponent,
    BonusStationMastersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    GwtBoardComponent
  ]
})
export class GwtModule {

  constructor(private provider: GwtProvider,
              private translateService: TranslateService) {
    GAME_PROVIDERS['gwt'] = provider;

    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('it', it, true);
    this.translateService.setTranslation('nl', nl, true);
    this.translateService.setTranslation('pt', pt, true);
  }

}
