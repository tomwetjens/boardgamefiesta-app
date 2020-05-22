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
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {LogComponent} from './log/log.component';
import {TrailComponent} from './trail/trail.component';
import {SharedModule} from '../shared/shared.module';
import {GAME} from '../shared/api';

@NgModule({
  declarations: [
    GwtBoardComponent,
    CardComponent,
    CardStackComponent,
    CattleMarketComponent,
    DeliveryCityComponent,
    EndedDialogComponent,
    HazardComponent,
    LogComponent,
    ObjectiveCardsComponent,
    ObjectivesDialogComponent,
    PlayerBoardComponent,
    PlayerBuildingsComponent,
    StationMasterComponent,
    TeepeeComponent,
    TrailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    GwtBoardComponent
  ],
  providers: [
    {provide: GAME, useValue: {id: 'gwt', boardComponent: GwtBoardComponent}, multi: true}
  ]
})
export class GwtModule {

}
