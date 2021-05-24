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
import { FamilyMemberPopoverComponent } from './family-member-popover/family-member-popover.component';
import { MerchantPopoverComponent } from './merchant-popover/merchant-popover.component';
import { AssistantPopoverComponent } from './assistant-popover/assistant-popover.component';
import { MosqueTileComponent } from './mosque-tile/mosque-tile.component';
import { MosqueTilePopoverComponent } from './mosque-tile-popover/mosque-tile-popover.component';
import { PlayerComponent } from './player/player.component';
import { ConfirmBonusCardDialogComponent } from './confirm-bonus-card-dialog/confirm-bonus-card-dialog.component';

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
    ConfirmBonusCardDialogComponent
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
