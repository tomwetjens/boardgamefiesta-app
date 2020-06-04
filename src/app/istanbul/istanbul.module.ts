import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IstanbulBoardComponent} from './istanbul-board/istanbul-board.component';
import {SharedModule} from '../shared/shared.module';
import {GAME} from '../shared/api';
import {SellGoodsDialogComponent} from './sell-goods-dialog/sell-goods-dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import { GuessDialogComponent } from './guess-dialog/guess-dialog.component';

@NgModule({
  declarations: [IstanbulBoardComponent, SellGoodsDialogComponent, GuessDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    IstanbulBoardComponent
  ],
  providers: [
    {
      provide: GAME,
      useValue: {
        id: 'istanbul',
        boardComponent: IstanbulBoardComponent
      },
      multi: true
    }
  ]
})
export class IstanbulModule {
}
