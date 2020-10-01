import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IstanbulBoardComponent} from './istanbul-board/istanbul-board.component';
import {SharedModule} from '../shared/shared.module';
import {GAME_PROVIDERS} from '../shared/api';
import {SellGoodsDialogComponent} from './sell-goods-dialog/sell-goods-dialog.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {GuessDialogComponent} from './guess-dialog/guess-dialog.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IstanbulProvider} from "./istanbul.provider";
import en from "./locale/en.json";
import nl from "./locale/nl.json";
import {RouterModule, Routes} from "@angular/router";
import {IstanbulComponent} from './istanbul/istanbul.component';

const routes: Routes = [
  {
    path: '',
    component: IstanbulComponent
  }
];

@NgModule({
  declarations: [
    IstanbulBoardComponent,
    SellGoodsDialogComponent,
    GuessDialogComponent,
    IstanbulComponent
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
export class IstanbulModule {

  constructor(private provider: IstanbulProvider,
              private translateService: TranslateService) {
    GAME_PROVIDERS['istanbul'] = provider;

    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('nl', nl, true);
  }
}
