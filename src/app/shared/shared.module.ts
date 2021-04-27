import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlayerNameComponent} from './player-name/player-name.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {InGameNavbarComponent} from './in-game-navbar/in-game-navbar.component';
import {ConnectionStatusComponent} from './connection-status/connection-status.component';
import {TimerComponent} from './timer/timer.component';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {RouterModule} from '@angular/router';
import {UserPopoverComponent} from './user-popover/user-popover.component';
import {UserNameComponent} from './user-name/user-name.component';
import {RatingComponent} from './rating/rating.component';
import {FromNowPipe} from './from-now.pipe';
import {AgoPipe} from './ago.pipe';
import {AvatarComponent} from './avatar/avatar.component';
import {MomentPipe} from './moment.pipe';
import {LogComponent} from './log/log.component';
import {InGameMenuComponent} from './in-game-menu/in-game-menu.component';
import {InGamePlayerComponent} from './in-game-player/in-game-player.component';
import {LocationIconComponent} from './location-icon/location-icon.component';
import {TableSummaryComponent} from './table-summary/table-summary.component';
import {LogTimePipe} from './log/log-time.pipe';
import {CalendarPipe} from "./calendar.pipe";

@NgModule({
  declarations: [
    AvatarComponent,
    ConnectionStatusComponent,
    PlayerNameComponent,
    InGameNavbarComponent,
    MessageDialogComponent,
    UserPopoverComponent,
    TimerComponent,
    UserNameComponent,
    RatingComponent,
    FromNowPipe,
    AgoPipe,
    MomentPipe,
    LogComponent,
    InGameMenuComponent,
    InGamePlayerComponent,
    LocationIconComponent,
    TableSummaryComponent,
    LogTimePipe,
    CalendarPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  exports: [
    AvatarComponent,
    ConnectionStatusComponent,
    MessageDialogComponent,
    PlayerNameComponent,
    InGameNavbarComponent,
    UserNameComponent,
    RatingComponent,
    FromNowPipe,
    AgoPipe,
    MomentPipe,
    LogComponent,
    InGamePlayerComponent,
    LocationIconComponent,
    TableSummaryComponent,
    UserPopoverComponent,
    CalendarPipe
  ]
})
export class SharedModule {
}
