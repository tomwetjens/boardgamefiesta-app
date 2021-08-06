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
import {BigBazarBoardComponent} from './big-bazar-board/big-bazar-board.component';
import {SharedModule} from '../shared/shared.module';
import {GAME_PROVIDERS} from '../shared/api';
import {SellGoodsDialogComponent} from './sell-goods-dialog/sell-goods-dialog.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {GuessDialogComponent} from './guess-dialog/guess-dialog.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BigBazarProvider} from "./big-bazar.provider";
import en from "./locale/en.json";
import nl from "./locale/nl.json";
import {RouterModule, Routes} from "@angular/router";
import {BigBazarComponent} from './big-bazar/big-bazar.component';
import {FamilyMemberPopoverComponent} from './family-member-popover/family-member-popover.component';
import {MerchantPopoverComponent} from './merchant-popover/merchant-popover.component';
import {AssistantPopoverComponent} from './assistant-popover/assistant-popover.component';
import {MosqueTileComponent} from './mosque-tile/mosque-tile.component';
import {MosqueTilePopoverComponent} from './mosque-tile-popover/mosque-tile-popover.component';
import {PlayerComponent} from './player/player.component';
import {ConfirmBonusCardDialogComponent} from './confirm-bonus-card-dialog/confirm-bonus-card-dialog.component';
import {BonusCardComponent} from './bonus-card/bonus-card.component';
import {BonusCardPopoverComponent} from './bonus-card-popover/bonus-card-popover.component';
import {BonusCardDeckComponent} from './bonus-card-deck/bonus-card-deck.component';
import {EndedDialogComponent} from './ended-dialog/ended-dialog.component';
import {DiscardPileDialogComponent} from "./discard-pile-dialog/discard-pile-dialog.component";

const routes: Routes = [
  {
    path: '',
    component: BigBazarComponent
  }
];

@NgModule({
  declarations: [
    BigBazarBoardComponent,
    SellGoodsDialogComponent,
    GuessDialogComponent,
    BigBazarComponent,
    FamilyMemberPopoverComponent,
    MerchantPopoverComponent,
    AssistantPopoverComponent,
    MosqueTileComponent,
    MosqueTilePopoverComponent,
    PlayerComponent,
    ConfirmBonusCardDialogComponent,
    BonusCardComponent,
    BonusCardPopoverComponent,
    BonusCardDeckComponent,
    EndedDialogComponent,
    DiscardPileDialogComponent
  ],
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
export class BigBazarModule {

  constructor(private provider: BigBazarProvider,
              private translateService: TranslateService) {
    GAME_PROVIDERS['big-bazar'] = provider;

    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('nl', nl, true);
  }
}
