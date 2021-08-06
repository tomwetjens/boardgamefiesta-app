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
import {TableDetailsComponent} from "./table-details/table-details.component";

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
    CalendarPipe,
    TableDetailsComponent
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
    CalendarPipe,
    TableDetailsComponent
  ]
})
export class SharedModule {
}
