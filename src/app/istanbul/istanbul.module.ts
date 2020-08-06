import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IstanbulBoardComponent} from './istanbul-board/istanbul-board.component';
import {SharedModule} from '../shared/shared.module';
import {GAME_PROVIDERS} from '../shared/api';
import {SellGoodsDialogComponent} from './sell-goods-dialog/sell-goods-dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {GuessDialogComponent} from './guess-dialog/guess-dialog.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [IstanbulBoardComponent, SellGoodsDialogComponent, GuessDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    IstanbulBoardComponent
  ]
})
export class IstanbulModule {

  constructor() {
    GAME_PROVIDERS['istanbul'] = {
      id: 'istanbul'
    };
  }
}
