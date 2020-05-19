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

@NgModule({
  declarations: [
    ConnectionStatusComponent,
    PlayerNameComponent,
    InGameNavbarComponent,
    MessageDialogComponent,
    TimerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  exports: [
    ConnectionStatusComponent,
    MessageDialogComponent,
    PlayerNameComponent,
    InGameNavbarComponent
  ]
})
export class SharedModule {
}
