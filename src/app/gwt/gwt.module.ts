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
import {BonusStationMastersComponent} from './bonus-station-masters/bonus-station-masters.component';
import {Gwt2Provider} from "./gwt2.provider";

const TRANSLATIONS = {'en': en, 'nl': nl, 'pt': pt, 'it': it};

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

  constructor(private gwtProvider: GwtProvider,
              private gwt2Provider: Gwt2Provider,
              private translateService: TranslateService) {
    GAME_PROVIDERS['gwt'] = gwtProvider;
    GAME_PROVIDERS['gwt2'] = gwt2Provider;

    Object.keys(TRANSLATIONS).forEach(language => {
      const translations = TRANSLATIONS[language];

      // Adding missing 'gwt2' translations from 'gwt', so we don't have to maintain duplicate strings across editions
      if (!translations.gwt2) {
        translations.gwt2 = {};
      }
      copyMissing(translations.gwt2, translations.gwt);

      this.translateService.setTranslation(language, translations, true);
    });
  }

}

function copyMissing(target: any, source: any): any {
  for (const key of Object.keys(source)) {
    if (!target[key]) {
      target[key] = source[key];
    } else if (typeof source[key] === 'object') {
      copyMissing(target[key], source[key]);
    }
  }
  return target;
}
